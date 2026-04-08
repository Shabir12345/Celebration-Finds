"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ArrowRight, Quote } from "lucide-react";
import { PortfolioEntry, DESIGN_CATEGORY_LABELS } from "@/types/portfolio";
import { transitions } from "@/lib/motion";

interface EventDetailModalProps {
  event: PortfolioEntry | null;
  onClose: () => void;
}

export default function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  return (
    <AnimatePresence>
      {event && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.normal}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            layoutId={`card-${event._id}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={transitions.normal}
            className="fixed inset-4 md:inset-8 lg:inset-20 z-[70] bg-white overflow-hidden flex flex-col md:flex-row shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white transition-colors rounded-full"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>

            {/* Left — cover image */}
            <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto shrink-0 bg-slate-900">
              <Image
                src={
                  event.coverImage?.asset?._ref
                    ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${event.coverImage.asset._ref
                        .replace("image-", "")
                        .replace(/-([a-z]+)$/, ".$1")}`
                    : "https://images.unsplash.com/photo-1603006905393-c36f51953282?auto=format&fit=crop&q=80"
                }
                alt={event.title}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>

            {/* Right — details */}
            <div className="flex-grow overflow-y-auto p-10 md:p-16 space-y-10">
              {/* Category badge */}
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-secondary/10 text-secondary text-[8px] font-bold uppercase tracking-[0.2em] rounded-full">
                  Design Case Study
                </span>
                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-slate-400">
                  {DESIGN_CATEGORY_LABELS[event.category]} · {event.date && new Date(event.date).getFullYear()}
                </p>
              </div>

              {/* Title */}
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-accent leading-tight tracking-tighter">
                {event.title}
              </h2>

              {/* Description */}
              {event.description && (
                <div className="space-y-4">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">The Concept</p>
                   <p className="text-base text-slate-600 leading-relaxed max-w-prose">
                      {event.description}
                   </p>
                </div>
              )}

              {/* Testimonial */}
              {event.clientTestimonial && (
                <div className="relative pl-8 border-l-2 border-secondary/30 space-y-3 py-2">
                  <Quote className="w-6 h-6 text-secondary/40" />
                  <p className="font-serif text-xl italic text-accent leading-relaxed">
                    &ldquo;{event.clientTestimonial}&rdquo;
                  </p>
                </div>
              )}

              {/* Products featured */}
              {event.productsUsed && event.productsUsed.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    Artisanal Units
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {event.productsUsed.map((product) => (
                      <span
                        key={product}
                        className="px-4 py-2 bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="pt-6">
                <a
                  href="/wholesale"
                  className="inline-flex items-center gap-4 px-10 py-5 bg-accent text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl hover:-translate-y-1 group"
                >
                  Inquire About Custom Design
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
