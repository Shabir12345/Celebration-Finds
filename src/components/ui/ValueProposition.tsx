"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Sparkles } from "lucide-react";

export const ValueProposition = () => {
  return (
    <section className="py-24 px-6 max-w-[1440px] mx-auto border-t border-[var(--color-border-subtle)]/50 mt-16">
      <div className="text-center mb-16">
         <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--color-text-tertiary)] mb-4 block">The Celebration Finds Standard</span>
         <h2 className="text-h2 font-serif text-[var(--color-text-primary)] mb-4">Uncompromising Quality & Service</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center border border-[var(--color-border-subtle)]">
            <ShieldCheck className="w-6 h-6 text-[var(--color-accent-gold)]" />
          </div>
          <div className="space-y-3">
            <h3 className="text-h3 font-serif text-[var(--color-text-primary)] tracking-tight">Artisanal Craftsmanship</h3>
            <p className="text-body-m text-[var(--color-text-secondary)] leading-relaxed max-w-sm font-light">
              We believe excellence lies in the details. Each piece is meticulously assembled by hand using sustainably sourced, premium materials to ensure an unboxing experience that commands attention.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center border border-[var(--color-border-subtle)]">
            <Zap className="w-6 h-6 text-[var(--color-accent-gold)]" />
          </div>
          <div className="space-y-3">
            <h3 className="text-h3 font-serif text-[var(--color-text-primary)] tracking-tight">Seamless Personalization</h3>
            <p className="text-body-m text-[var(--color-text-secondary)] leading-relaxed max-w-sm font-light">
              Our intuitive design studio bridges your vision with our execution. Specify hues, select premium fragrances, and engrave bespoke messages with absolute confidence and ease.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center border border-[var(--color-border-subtle)]">
            <Sparkles className="w-6 h-6 text-[var(--color-accent-gold)]" />
          </div>
          <div className="space-y-3">
            <h3 className="text-h3 font-serif text-[var(--color-text-primary)] tracking-tight">Curated for Milestones</h3>
            <p className="text-body-m text-[var(--color-text-secondary)] leading-relaxed max-w-sm font-light">
              From executive corporate galas to exclusive private ceremonies, our collections are sophisticated accompaniments designed to elevate the ambiance of your most significant events.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
