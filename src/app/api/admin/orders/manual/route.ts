import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    // 0. Verify admin session via cookie
    const accessToken = req.cookies.get('sb-access-token')?.value
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Secure server-side key
    )

    const { data: { user } } = await adminClient.auth.getUser(accessToken)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { customer_name, customer_email, total_amount, order_source, items } = await req.json()

    // 1. Create the order
    const { data: order, error: orderErr } = await adminClient
      .from('orders')
      .insert([{
        customer_name,
        customer_email,
        total_amount,
        status: 'pending',
        order_source,
      }])
      .select()
      .single()

    if (orderErr) throw orderErr

    // 2. Create order items if provided
    if (items && items.length > 0) {
      const lineItems = items.map((item: any) => ({
        order_id: order.id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        customizations: item.customizations || {},
      }))

      const { error: itemsErr } = await adminClient
        .from('order_items')
        .insert(lineItems)

      if (itemsErr) throw itemsErr
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err: any) {
    console.error('Manual order error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
