"use server";

import { stripe } from "@/lib/stripe";
import { CartItem } from "@/hooks/useCart";
import { headers } from "next/headers";

export async function createCheckoutSession(items: CartItem[]) {
  try {
    const origin = (await headers()).get("origin");

    if (!items || items.length === 0) {
      throw new Error("Cart is empty");
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productName,
          images: [item.image],
          description: Object.entries(item.customizations)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", "),
          metadata: {
            productId: item.productId,
            customizations: JSON.stringify(item.customizations),
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB"], // Expand as needed
      },
      metadata: {
        orderType: "custom_gift",
      },
    });

    return { url: session.url };
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    throw new Error(error.message || "Failed to create checkout session");
  }
}
