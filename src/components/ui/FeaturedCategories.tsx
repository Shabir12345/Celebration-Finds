"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const categories = [
  { 
    name: "Weddings", 
    href: "/shop/weddings", 
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
    description: "Elegant favours for your special day." 
  },
  { 
    name: "Baby Showers", 
    href: "/shop/baby-showers", 
    image: "https://images.unsplash.com/photo-1555243896-c709bfa0b58a?auto=format&fit=crop&q=80",
    description: "Sweet, personalized gifts for new arrivals." 
  },
  { 
    name: "Birthdays", 
    href: "/shop/birthdays", 
    image: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?auto=format&fit=crop&q=65",
    description: "Fun, custom treats for every milestone." 
  },
  { 
    name: "Corporate", 
    href: "/shop/corporate", 
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80",
    description: "Branded premiums for companies & events." 
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-28 bg-[var(--color-bg-primary)] overflow-hidden border-t border-[var(--color-border-subtle)]/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-20">
          <span className="text-[var(--color-accent-gold)] text-xs font-semibold tracking-[0.4em] uppercase">The Registry</span>
          <h2 className="font-serif text-4xl md:text-6xl text-[var(--color-text-primary)] tracking-tight">
            Discover Our Collections
          </h2>
          <p className="font-sans text-body-m text-[var(--color-text-secondary)] max-w-2xl font-light italic">
            Lovingly designed and customizable favours, from delicate candles to bespoke keepsakes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group relative h-[450px] overflow-hidden bg-[var(--color-bg-tertiary)] shadow-elegant hover:shadow-modal transition-all duration-700 hover:-translate-y-2 rounded-sm"
            >
              <Link href={cat.href} className="block w-full h-full relative">
                <Image 
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 relative z-10 brightness-[0.85] group-hover:brightness-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent-navy)]/90 via-transparent to-transparent group-hover:from-[var(--color-accent-navy)] transition-all duration-500 z-20" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-8 space-y-3 z-30">
                  <h3 className="text-white font-serif text-3xl font-bold tracking-tight transform transition-transform duration-500 group-hover:-translate-y-2">
                    {cat.name}
                  </h3>
                  <p className="text-white/70 text-sm font-light tracking-wide leading-relaxed transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    {cat.description}
                  </p>
                  <div className="pt-6 flex items-center gap-3 text-white font-bold uppercase tracking-[0.3em] text-[10px] transform opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 delay-200">
                    <span className="gold-foil-text">Explore Collection</span>
                    <div className="w-12 h-[1px] bg-[var(--color-accent-gold)]" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
