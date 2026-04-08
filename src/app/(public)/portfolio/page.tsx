import { client } from "@/lib/sanity";
import { PORTFOLIO_ENTRIES_QUERY } from "@/lib/queries";
import LookbookClientGrid from "@/components/portfolio/LookbookClientGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Portfolio | Celebration Finds",
  description: "Explore our archive of custom design works. A professional showcase for vendors, event planners, and business partners.",
};

// Revalidate every hour
export const revalidate = 3600;

export default async function PortfolioPage() {
  let entries = [];
  try {
    entries = await client.fetch(PORTFOLIO_ENTRIES_QUERY);
  } catch (error) {
    console.warn("Could not fetch portfolio entries from Sanity.", error);
  }

  return (
    <div className="bg-white">
      {/* Editorial Hero Section */}
      <section className="pt-40 pb-24 border-b border-slate-50 bg-[#0F172A] text-white">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-4 max-w-4xl">
             <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Design Archive</p>
             <h1 className="font-serif text-5xl md:text-8xl font-bold tracking-tighter leading-none">
                The Art of <span className="italic text-secondary font-light">Custom</span>
             </h1>
          </div>
          <p className="font-sans text-sm md:text-lg text-slate-400 max-w-2xl mx-auto font-medium tracking-wide leading-relaxed">
             A showcase of our most ambitious design projects. Built for creators, planners, and brands who demand excellence in every detail.
          </p>
        </div>
      </section>

      {/* Partnership Focus Sections */}
      <section className="py-24 container mx-auto px-4 md:px-6 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 text-accent font-serif italic text-xl">01</div>
            <h2 className="font-serif text-2xl font-bold text-accent">Design Excellence</h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">We push the boundaries of custom gifting with unique textures, materials, and techniques that set your projects apart from the ordinary.</p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 text-accent font-serif italic text-xl">02</div>
            <h2 className="font-serif text-2xl font-bold text-accent">Vendor Partnerships</h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">Collaborate with us to create exclusive white-label products or custom-branded collections for your venue, boutique, or corporate clients.</p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 text-accent font-serif italic text-xl">03</div>
            <h2 className="font-serif text-2xl font-bold text-accent">Scalable Solutions</h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">From artisanal single-run designs to high-volume corporate orders, our production process is built to maintain quality at any scale.</p>
          </div>
        </div>
      </section>

      {/* Interactive Portfolio Grid */}
      <section className="py-24 container mx-auto px-4 md:px-6 min-h-[600px]">
        <div className="mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-accent mb-4">The Collection</h2>
          <p className="text-slate-500 max-w-xl">Filter by design style to explore how we adapt our craftsmanship to different brand identities and event concepts.</p>
        </div>
        <LookbookClientGrid entries={entries?.length ? entries : undefined} />
      </section>

      {/* Business/Wholesale CTA */}
      <section className="py-32 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center space-y-12">
              <div className="space-y-6 max-w-3xl">
                  <h2 className="font-serif text-4xl md:text-7xl font-bold text-accent tracking-tighter leading-none">Let&apos;s Build Something <span className="italic font-light">Extraordinary</span></h2>
                  <p className="font-sans text-slate-500 max-w-xl mx-auto font-medium tracking-wide leading-relaxed">
                      We are always looking for visionary partners to collaborate with. Whether you&apos;re a wedding planner, interior designer, or corporate brand, we have the tools to make your vision a reality.
                  </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                 <a 
                    href="/wholesale"
                    className="px-12 py-6 bg-accent text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-primary transition-all shadow-2xl hover:-translate-y-1"
                 >
                    Become a Partner
                 </a>
                 <a 
                    href="/demo-builder"
                    className="px-12 py-6 bg-white text-accent border border-slate-200 font-bold uppercase tracking-[0.2em] text-[10px] hover:border-accent transition-all shadow-sm hover:-translate-y-1"
                 >
                    Explore Customization
                 </a>
              </div>
          </div>
      </section>
    </div>
  );
}
