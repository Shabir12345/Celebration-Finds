import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { client as sanityClient } from '@/lib/sanity'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Fetch product catalog from Sanity to inject as knowledge
async function fetchProductContext(): Promise<string> {
  try {
    const products = await sanityClient.fetch(`
      *[_type == "product"] {
        name,
        description,
        "price": priceBase,
        "category": category->name,
        isFeatured
      } | order(isFeatured desc)[0...30]
    `)

    if (!products || products.length === 0) {
      return 'No products currently available in the catalog.'
    }

    const lines = products.map((p: { name?: string; category?: string; price?: number; description?: string }) => {
      const price = p.price ? `$${Number(p.price).toFixed(2)}` : 'Contact for pricing'
      const cat = p.category ? ` (${p.category})` : ''
      const desc = p.description ? ` — ${p.description}` : ''
      return `• ${p.name}${cat}: ${price}${desc}`
    })

    return `LIVE PRODUCT CATALOG:\n${lines.join('\n')}`
  } catch {
    return 'Product catalog temporarily unavailable.'
  }
}

// Fetch chatbot settings from Supabase
async function fetchSettings() {
  const { data } = await supabase
    .from('chatbot_settings')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single()

  return data
}

// Ensure chat session exists or create it
async function ensureSession(sessionToken: string, pageUrl?: string) {
  const { data: existing } = await supabase
    .from('chat_sessions')
    .select('id, message_count')
    .eq('session_token', sessionToken)
    .single()

  if (existing) return existing

  const { data: created } = await supabase
    .from('chat_sessions')
    .insert({ session_token: sessionToken, page_url: pageUrl || null })
    .select('id, message_count')
    .single()

  return created
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, history = [], sessionToken, pageUrl } = body as any

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!sessionToken) {
      return NextResponse.json({ error: 'Session token is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    // Load settings first, then product context conditionally
    const settings = await fetchSettings()

    // If bot is disabled, return a polite message
    if (settings && !settings.is_enabled) {
      return NextResponse.json({
        reply: "I'm currently offline, but our team is always happy to help! Please use the contact form or email us directly.",
        sessionId: null,
      })
    }

    const productContext = settings?.include_products ? await fetchProductContext() : ''

    const systemPrompt = settings?.system_prompt || 'You are Celeste, a luxury gift expert. ONE STEP AT A TIME: NEVER ask more than one question at once. Keep responses concise and focused on 1-2 product recommendations from our catalog.'
    const fullSystemPrompt = productContext
      ? `${systemPrompt}\n\n---\n${productContext}`
      : systemPrompt

    // Ensure session exists in DB and check limits
    const session = await ensureSession(sessionToken, pageUrl)
    const sessionId = session?.id
    const messageCount = session?.message_count || 0

    if (messageCount > 50) {
      return NextResponse.json({ 
        reply: "You've reached the message limit for this session. Please refresh to start a new chat or contact our team directly for further assistance! 💛",
        sessionId 
      })
    }

    // Build message history for Gemini (Limit to last 15 messages to keep it fast)
    const recentHistory = history.slice(-15)
    
    const geminiHistory = recentHistory.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    // Call Google Gemini API with timeout
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000) // 20s timeout

    const geminiBody = {
      system_instruction: {
        parts: [{ text: fullSystemPrompt }],
      },
      contents: [
        ...geminiHistory,
        { role: 'user', parts: [{ text: message }] },
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 400,
        topP: 0.9,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    }

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId))

    if (!geminiRes.ok) {
      const err = await geminiRes.text()
      console.error('Gemini API error:', err)
      return NextResponse.json({ error: 'AI service error' }, { status: 502 })
    }

    const geminiData = await geminiRes.json()
    const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!reply) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 502 })
    }

    // Save user message + AI reply to Supabase (fire & forget style — don't block response)
    if (sessionId) {
      supabase.from('chat_messages').insert([
        { session_id: sessionId, role: 'user', content: message },
        { session_id: sessionId, role: 'assistant', content: reply },
      ]).then(() => {
        // Increment message count on session
        supabase
          .from('chat_sessions')
          .update({ message_count: (history.length / 2 + 1), updated_at: new Date().toISOString() })
          .eq('id', sessionId)
          .then(() => {})
      })
    }

    return NextResponse.json({ reply, sessionId })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
