"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ArrowRight, Quote } from "lucide-react";
import { PortfolioEvent } from "@/types/portfolio";
import { transitions } from "@/lib/motion";

interface EventDetailModalProps {
  event: PortfolioEvent | null;
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
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            layoutId={`card-${event._id}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={transitions.normal}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-[70] bg-white overflow-hidden flex flex-col md:flex-row shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>

            {/* Left — cover image */}
            <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto shrink-0 bg-slate-200">
              <Image
                src={
                  event.coverImage?.asset?._ref
                    ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${event.coverImage.asset._ref
                        .replace("image-", "")
                        .replace(/-([a-z]+)$/, ".$1")}`
                    : "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80"
                }
                alt={event.title}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>

            {/* Right — details */}
            <div className="flex-grow overflow-y-auto p-8 md:p-12 space-y-8">
              {/* Event type badge */}
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#1A4338]">
                {event.eventType.replace("-", " ")} ·{" "}
                {event.date &&
                  new Date(event.date).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "long",
                  })}
              </p>

              {/* Title */}
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-slate-800 leading-tight tracking-tight">
                {event.title}
              </h2>

              {/* Description */}
              {event.description && (
                <p className="text-sm text-slate-500 leading-relaxed max-w-prose">
                  {event.description}
                </p>
              )}

              {/* Testimonial */}
              {event.clientTestimonial && (
                <div className="relative pl-6 border-l-2 border-[#F2D8D5] space-y-2">
                  <Quote className="w-5 h-5 text-[#F2D8D5] mb-1" />
                  <p className="font-serif text-lg italic text-slate-700 leading-relaxed">
                    &ldquo;{event.clientTestimonial}&rdquo;
                  </p>
                </div>
              )}

              {/* Products used */}
              {event.productsUsed && event.productsUsed.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Products Featured
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {event.productsUsed.map((product) => (
                      <span
                        key={product}
                        className="px-3 py-1.5 bg-[#F5F2EB] text-[10px] font-bold uppercase tracking-widest text-slate-600"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <a
                href="/wholesale"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#1A4338] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A4338]/90 transition-all shadow-lg hover:-translate-y-0.5 group"
              >
                Book a Similar Event
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
