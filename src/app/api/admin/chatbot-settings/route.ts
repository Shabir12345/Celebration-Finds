import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001'

// GET — fetch current chatbot settings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('chatbot_settings')
      .select('*')
      .eq('id', SETTINGS_ID)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error('GET chatbot settings error:', err)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT — update chatbot settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { bot_name, greeting_message, system_prompt, is_enabled, include_products } = body

    const { data, error } = await supabase
      .from('chatbot_settings')
      .update({
        ...(bot_name !== undefined && { bot_name }),
        ...(greeting_message !== undefined && { greeting_message }),
        ...(system_prompt !== undefined && { system_prompt }),
        ...(is_enabled !== undefined && { is_enabled }),
        ...(include_products !== undefined && { include_products }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', SETTINGS_ID)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error('PUT chatbot settings error:', err)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
