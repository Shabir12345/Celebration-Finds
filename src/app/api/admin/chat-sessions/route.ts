import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET — fetch all sessions (with message preview)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')

    // If sessionId provided, return messages for that session
    if (sessionId) {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return NextResponse.json(data)
    }

    // Otherwise return all sessions
    const { data, error } = await supabase
      .from('chat_sessions')
      .select(`
        id,
        session_token,
        customer_name,
        customer_email,
        page_url,
        message_count,
        status,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) throw error

    // For each session, fetch the last message as a preview
    const sessionsWithPreview = await Promise.all(
      (data || []).map(async (session) => {
        const { data: lastMsg } = await supabase
          .from('chat_messages')
          .select('content, role')
          .eq('session_id', session.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        return {
          ...session,
          last_message: lastMsg?.content?.substring(0, 120) ?? null,
          last_message_role: lastMsg?.role ?? null,
        }
      })
    )

    return NextResponse.json(sessionsWithPreview)
  } catch (err) {
    console.error('GET chat-sessions error:', err)
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }
}

// PATCH — update session status or customer info
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, status, customer_name, customer_email } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .update({
        ...(status && { status }),
        ...(customer_name && { customer_name }),
        ...(customer_email && { customer_email }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('PATCH chat-sessions error:', err)
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
  }
}
