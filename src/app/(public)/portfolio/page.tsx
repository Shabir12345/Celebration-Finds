import { client } from "@/lib/sanity";
import { PORTFOLIO_ENTRIES_QUERY } from "@/lib/queries";
import LookbookClientGrid from "@/components/portfolio/LookbookClientGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Celebration Finds Lookbook",
  description: "Look through our beautiful photo gallery. See real celebrations styled perfectly with our unforgettable custom gifts.",
};

// Revalidate every hour
export const revalidate = 3600;

export default async function PortfolioPage() {
  let entries = [];
  try {
    entries = await client.fetch(PORTFOLIO_ENTRIES_QUERY);
  } catch (error) {
    console.warn("Could not fetch portfolio entries from Sanity. Check your credentials.", error);
    // In production, you might want to log this to an external service.
  }

  return (
    <div className="bg-white">
      {/* Editorial Hero Section */}
      <section className="pt-40 pb-20 border-b border-slate-50 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-4 max-w-4xl">
             <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">The Lookbook</p>
             <h1 className="font-serif text-5xl md:text-8xl font-bold tracking-tighter leading-none">
                A Gallery of <span className="italic text-secondary">Happiness</span>
             </h1>
          </div>
          <p className="font-sans text-sm md:text-lg text-slate-400 max-w-2xl mx-auto font-medium tracking-wide leading-relaxed">
             Look through our beautiful photo gallery. See real celebrations styled perfectly with our unforgettable custom gifts.
          </p>
        </div>
      </section>

      {/* Feature / Benefit Sections */}
      <section className="py-24 container mx-auto px-4 md:px-6 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-accent">Real Weddings, Real Inspiration</h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">Step inside breathtaking villas and modern party spaces. Our photo gallery shows real, joyful events, proving that beautiful gifts make any party better.</p>
          </div>
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-accent">Amazing Table Styling</h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">We don't just sell gifts; we help create beautiful moments. See how top event planners place our custom favors on gorgeous dinner tables.</p>
          </div>
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-accent">Steal Their Beautiful Style</h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">Did you fall in love with a specific look? Every photo gallery is shoppable. You can easily click to buy the exact same gifts for your own special day.</p>
          </div>
        </div>
      </section>

      {/* Interactive Portfolio Grid */}
      <section className="py-24 container mx-auto px-4 md:px-6 min-h-[600px]">
        <LookbookClientGrid events={entries?.length ? entries : undefined} />
      </section>

      {/* Corporate/Wholesale CTA */}
      <section className="py-32 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center space-y-12">
              <div className="space-y-4 max-w-3xl">
                  <h2 className="font-serif text-4xl md:text-6xl font-bold text-accent tracking-tight leading-none">Give Your Clients the Best</h2>
                  <p className="font-sans text-slate-500 max-w-xl mx-auto font-medium tracking-wide leading-relaxed">
                      Partner with Celebration Finds to bring beautiful, custom luxury to your corporate events, big weddings, and VIP gifting.
                  </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                 <a 
                    href="/wholesale"
                    className="px-12 py-6 bg-accent text-white font-bold uppercase tracking-widest text-[10px] hover:bg-primary transition-all shadow-2xl hover:-translate-y-1"
                 >
                    Inquire About Partnerships
                 </a>
                 <a 
                    href="/shop"
                    className="px-12 py-6 bg-white text-accent border border-slate-200 font-bold uppercase tracking-widest text-[10px] hover:border-accent transition-all shadow-sm hover:-translate-y-1"
                 >
                    Browse Collection
                 </a>
              </div>
          </div>
      </section>
    </div>
  );
}
