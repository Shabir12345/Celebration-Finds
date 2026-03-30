import Link from "next/link";
import { MoveRight } from "lucide-react";

const categories = [
  {
    title: "Wedding Favours",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
    href: "/shop?category=wedding",
    tagline: "Elegant & Timeless",
    span: "col-span-1 md:col-span-2"
  },
  {
    title: "Baby Showers",
    image: "https://images.unsplash.com/photo-1512418490979-92798ccc13fb?auto=format&fit=crop&q=80",
    href: "/shop?category=baby",
    tagline: "Sweet & Tender",
    span: "col-span-1"
  },
  {
    title: "Corporate Gifting",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80",
    href: "/shop?category=corporate",
    tagline: "Professional & Bespoke",
    span: "col-span-1"
  },
  {
    title: "Seasonal Gifts",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80",
    href: "/shop?category=seasonal",
    tagline: "Festive & Handcrafted",
    span: "col-span-1 md:col-span-2"
  }
];

export default function FeaturedCategories() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-primary">
              <span>Collection Overview</span>
              <span className="w-8 h-px bg-primary/30" />
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-accent tracking-tighter leading-none">
              Shop by <span className="italic text-primary">Occasion</span>
            </h2>
            <p className="font-sans text-sm md:text-base text-slate-500 font-medium tracking-wide leading-relaxed">
              Find the perfect piece to complement your vision. From delicate candles to bespoke engravings, every item is crafted with your story in mind.
            </p>
          </div>
          <Link 
            href="/shop"
            className="flex items-center space-x-3 text-xs font-bold uppercase tracking-[0.2em] text-accent hover:text-primary transition-colors group"
          >
            <span>Explore All</span>
            <MoveRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, idx) => (
            <Link 
              key={idx}
              href={cat.href}
              className={`group relative overflow-hidden bg-slate-100 aspect-[4/5] ${cat.span} shadow-lg`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url('${cat.image}')` }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {cat.tagline}
                </p>
                <h3 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-4 group-hover:text-secondary transition-colors">
                  {cat.title}
                </h3>
                <div className="h-px w-0 bg-secondary group-hover:w-20 transition-all duration-700" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
