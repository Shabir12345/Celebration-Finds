"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const TrustBanner = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-full py-8 bg-[var(--color-bg-secondary)]/50 border-b border-[var(--color-border-subtle)]/50 overflow-hidden", className)}>
      <div className="container mx-auto px-6">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-tertiary)] mb-6">
          Recognized For Excellence By
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-60 grayscale filter hover:grayscale-0 transition-all duration-700">
          
          {/* Vogue Style Logo */}
          <div className="font-serif text-2xl tracking-[0.1em] text-[var(--color-text-primary)] font-medium">VOGUE</div>
          
          {/* Brides Style Logo */}
          <div className="font-serif text-2xl tracking-tighter text-[var(--color-text-primary)] font-light italic">Brides</div>
          
          {/* The Knot Style Logo */}
          <div className="font-sans text-xl font-black tracking-[-0.05em] text-[var(--color-text-primary)]">the knot</div>
          
          {/* Harper's Bazaar Style Logo */}
          <div className="font-serif text-xl tracking-[0.2em] text-[var(--color-text-primary)] font-bold uppercase">Harper's Bazaar</div>
          
          {/* Style Me Pretty Logo */}
          <div className="font-serif text-xl tracking-tight text-[var(--color-text-primary)] italic">Style Me Pretty</div>

        </div>
      </div>
    </div>
  );
};
