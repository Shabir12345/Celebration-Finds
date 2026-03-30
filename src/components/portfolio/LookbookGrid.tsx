"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface PortfolioEntry {
  title: string;
  slug: string;
  eventType: string;
  image: string;
  isFeatured?: boolean;
}

interface LookbookGridProps {
  entries: PortfolioEntry[];
}

/**
 * Legacy static grid — used on the home page and old embeds.
 * For the full interactive portfolio with filters and modal,
 * see LookbookClientGrid.tsx.
 */
export default function LookbookGrid({ entries }: LookbookGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 auto-rows-[minmax(200px,auto)] w-full">
      {entries.map((entry) => (
        <motion.div
          key={entry.slug}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden group bg-slate-100"
        >
          <Image
            src={entry.image}
            alt={entry.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 gap-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/70">
              {entry.eventType}
            </span>
            <span className="font-serif text-base text-white text-center leading-tight">
              {entry.title}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
