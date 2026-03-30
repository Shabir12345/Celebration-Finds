import { client } from "@/lib/sanity";
import { ALL_PRODUCTS_QUERY } from "@/lib/queries";
import ShopClientShell from "@/components/shop/ShopClientShell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Gifts | Celebration Finds",
  description:
    "See our beautiful collection of custom party favors. Soft, elegant, and ready for your big day.",
};

export const revalidate = 3600;

export default async function ShopPage() {
  let products: any[] = [];
  try {
    products = await client.fetch(ALL_PRODUCTS_QUERY);
  } catch (error) {
    console.warn("Could not fetch products from Sanity.", error);
  }

  return (
    <div className="bg-[var(--color-bg-primary)]">
      {/* Editorial Hero */}
      <section className="pt-40 pb-20 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-4 max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-accent-emerald)]">
              Made for You
            </p>
            <h1 className="font-serif text-5xl md:text-8xl font-bold text-[var(--color-text-primary)] tracking-tighter leading-none">
              Build the Perfect Favor.
            </h1>
          </div>
          <p className="font-sans text-sm md:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto font-medium tracking-wide leading-relaxed">
            Carefully made collections of custom gifts — soft, elegant, and ready to be
            personalised for your big day.
          </p>
        </div>
      </section>

      {/* Live Filter Shell — client component */}
      <ShopClientShell products={products} />

      {/* B2B Promo Banner */}
      <section className="bg-[var(--color-text-primary)] py-32 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="space-y-6 max-w-2xl text-center lg:text-left">
            <h2 className="font-serif text-4xl md:text-6xl font-bold tracking-tight">
              Give Your Clients{" "}
              <span className="italic text-[var(--color-accent-gold)]">the Best.</span>
            </h2>
            <p className="text-white/80 font-sans text-sm md:text-base tracking-wide leading-relaxed font-light">
              Partner with Celebration Finds to bring beautiful, custom luxury to your corporate
              events, big weddings, and VIP gifting.
            </p>
          </div>
          <a
            href="/wholesale"
            className="px-12 py-6 bg-white text-[var(--color-text-primary)] font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--color-accent-gold)] hover:text-white luxury-transition shadow-2xl hover:-translate-y-1 shrink-0"
          >
            Learn About Partnerships
          </a>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 transform translate-x-1/2" />
      </section>
    </div>
  );
}
