import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | Celebration Finds",
  description: "Learn more about Celebration Finds and our mission to create bespoke, handcrafted gifts for your most special moments.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-40 pb-20 border-b border-slate-50 bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Our Story</p>
            <h1 className="font-serif text-5xl md:text-8xl font-bold tracking-tighter leading-none">
              Made With <span className="italic text-secondary">Lots of Love.</span>
            </h1>
          </div>
          <p className="font-sans text-sm md:text-lg text-slate-400 max-w-2xl mx-auto font-medium tracking-wide leading-relaxed">
            We believe in the magic of the little things. We create beautiful, memorable bits of joy to celebrate life’s happiest days.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2" />
      </section>

      {/* Content Section */}
      <section className="py-24 lg:py-40 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80"
              alt="Our Workshop"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="font-serif text-4xl font-bold text-accent tracking-tight">A Dream Born From <span className="text-primary">Parties</span></h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                Celebration Finds started to solve a simple problem: party gifts often lacked warmth and true luxury. We wanted to create gifts as beautiful as the memories they celebrate.
              </p>
              <p className="text-slate-500 leading-relaxed font-medium">
                We never cut corners. From pushing shiny foil onto paper to pouring natural wax into jars, every pretty piece is made by hand in our bright, sunny studio.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100">
               <div className="space-y-2">
                  <h4 className="font-bold text-accent italic">Made by Hand</h4>
                  <p className="text-xs text-slate-400 font-medium">Every piece is poured and wrapped with care.</p>
               </div>
               <div className="space-y-2">
                  <h4 className="font-bold text-accent italic">Caring for the Earth</h4>
                  <p className="text-xs text-slate-400 font-medium">We use materials that protect our planet.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl space-y-12">
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-accent tracking-tight">Our Philosophy</h2>
              <blockquote className="font-serif text-2xl md:text-4xl italic text-slate-400 leading-snug">
                "We believe that the most powerful gifts are those that tell a story—your story."
              </blockquote>
              <div className="pt-8">
                 <a 
                    href="/portfolio"
                    className="px-12 py-6 bg-accent text-white font-bold uppercase tracking-widest text-[10px] hover:bg-primary transition-all shadow-xl"
                 >
                    View Our Lookbook
                 </a>
              </div>
          </div>
      </section>
    </div>
  );
}
