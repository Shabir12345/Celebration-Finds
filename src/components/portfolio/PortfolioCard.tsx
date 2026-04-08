"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PortfolioEntry, DESIGN_CATEGORY_LABELS } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface PortfolioCardProps {
  event: PortfolioEntry;
  onSelect: (entry: PortfolioEntry) => void;
  imageUrl: string;
  spanSize?: "1x1" | "1x2" | "2x2";
}

export default function PortfolioCard({
  event,
  onSelect,
  imageUrl,
  spanSize = "1x1",
}: PortfolioCardProps) {
  return (
    <motion.div
      layoutId={`card-${event._id}`}
      onClick={() => onSelect(event)}
      className={cn(
        "relative cursor-pointer overflow-hidden group bg-slate-100",
        spanSize === "1x2" && "row-span-2",
        spanSize === "2x2" && "col-span-2 row-span-2"
      )}
      whileHover="hover"
    >
      {/* Image */}
      <motion.div
        variants={{ hover: { scale: 1.04 } }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>

      {/* Hover overlay */}
      <motion.div
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-6"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-secondary">
          {DESIGN_CATEGORY_LABELS[event.category]}
        </span>
        <h3 className="font-serif text-2xl md:text-3xl text-white text-center leading-tight">
          {event.title}
        </h3>
        {event.date && (
          <span className="text-[10px] text-white/60 font-medium">
            {new Date(event.date).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
            })}
          </span>
        )}
        <div className="mt-2 px-6 py-3 border border-white/40 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
          View Design
        </div>
      </motion.div>
    </motion.div>
  );
}
