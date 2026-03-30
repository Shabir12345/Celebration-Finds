"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TestimonialBlockProps {
  quote: string;
  author: string;
  role?: string; // e.g., "Bride", "Corporate Event Planner"
}

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({
  quote,
  author,
  role,
}) => {
  // Add a very subtle parallax to the quotation mark background based on scroll
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section className="relative w-full py-24 md:py-32 px-6 flex items-center justify-center bg-[var(--color-bg-primary)] overflow-hidden">
      {/* Massive Quotation Mark Background */}
      <motion.div
        style={{ y: yOffset }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
      >
        <span className="text-[280px] md:text-[400px] leading-none font-serif text-[var(--color-brand-blush)] opacity-[0.15]">
          &ldquo;
        </span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="relative z-10 max-w-4xl text-center flex flex-col items-center"
      >
        <h2 className="text-h2 md:text-h1 font-serif text-[var(--color-text-primary)] leading-tight mb-10 tracking-[0.01em]">
          {quote}
        </h2>
        
        <div className="flex flex-col items-center space-y-1">
          <span className="text-ui font-sans font-semibold text-[var(--color-text-primary)] uppercase tracking-widest">
            {author}
          </span>
          {role && (
            <span className="text-micro font-sans text-[var(--color-text-secondary)] tracking-widest uppercase opacity-80">
              {role}
            </span>
          )}
        </div>
      </motion.div>
    </section>
  );
};
