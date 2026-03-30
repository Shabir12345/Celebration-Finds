"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] scale-110 motion-safe:hover:scale-100"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80')" }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {/* Content Container */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
                <span className="h-px w-8 bg-primary/60" />
                <p className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-white/80">
                  Custom Handcrafted Favours
                </p>
                <span className="h-px w-8 bg-primary/60" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-9xl font-bold text-white tracking-tighter leading-none">
              Celebration <span className="text-secondary italic">Finds</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-sans text-sm md:text-xl text-slate-200/90 max-w-2xl mx-auto font-medium tracking-wide leading-relaxed"
          >
            Curating bespoke party favours that transform your most precious moments into lifelong memories. Handcrafted with love for your special day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Link 
              href="/shop"
              className="group relative px-12 py-5 bg-white text-accent font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-white transition-all duration-300 shadow-2xl overflow-hidden"
            >
              <span className="relative z-10">Shop Collection</span>
              <div className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </Link>
            
            <Link 
              href="/portfolio"
              className="px-12 py-5 bg-transparent border border-white/30 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
            >
              The Lookbook
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 opacity-50"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
}
