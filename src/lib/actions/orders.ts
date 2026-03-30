"use server";

import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function confirmOrder(sessionId: string) {
  try {
    // 1. Fetch the Stripe session to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    // 2. Map Stripe session to our Order structure
    // We cast to any here because the precise nesting can vary in the preview types
    const sess = session as any;
    
    const orderData = {
      stripe_session_id: sess.id,
      customer_email: sess.customer_details?.email,
      customer_name: sess.customer_details?.name,
      amount_total: sess.amount_total ? sess.amount_total / 100 : 0,
      shipping_address: sess.shipping_details?.address || sess.customer_details?.address,
      status: "paid",
      created_at: new Date().toISOString(),
      items: sess.line_items?.data.map((item: any) => ({
        name: item.description,
        quantity: item.quantity,
        price: item.amount_total / 100,
        metadata: item.price.product.metadata || {},
      })),
    };

    // 3. Persist to Supabase
    // Note: We use upsert with stripe_session_id as a unique constraint to prevent duplicates
    const { data, error } = await supabase
      .from("orders")
      .upsert(
        [orderData],
        { onConflict: "stripe_session_id" }
      )
      .select()
      .single();

    if (error) throw error;

    return { success: true, order: data };
  } catch (error: any) {
    console.error("Order Confirmation Error:", error);
    return { success: false, error: error.message };
  }
}
