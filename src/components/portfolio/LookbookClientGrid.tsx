"use client";

import { useMemo, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { PortfolioEntry, DesignCategory, DESIGN_CATEGORY_LIST, DESIGN_CATEGORY_LABELS } from "@/types/portfolio";
import { useEventModal } from "@/hooks/useEventModal";
import PortfolioCard from "./PortfolioCard";
import EventDetailModal from "./EventDetailModal";
import { cn } from "@/lib/utils";

// Fallback stock images per design category
const FALLBACK_IMAGES: Record<string, string> = {
  sculpted:   "https://images.unsplash.com/photo-1603006905393-c36f51953282?auto=format&fit=crop&q=80",
  minimalist: "https://images.unsplash.com/photo-1595113316349-9fa4ee24ef88?auto=format&fit=crop&q=80",
  luxe:       "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80",
  branded:    "https://images.unsplash.com/photo-1623126387971-5197711446a8?auto=format&fit=crop&q=80",
  other:      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80",
};

function resolveImageUrl(entry: PortfolioEntry): string {
  if (entry.coverImage?.asset?._ref) {
    const ref = entry.coverImage.asset._ref
      .replace("image-", "")
      .replace(/-([a-z]+)$/, ".$1");
    return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${ref}`;
  }
  return FALLBACK_IMAGES[entry.category] ?? FALLBACK_IMAGES["other"];
}

// Demo design entries shown when no Sanity data
const DEMO_ENTRIES: PortfolioEntry[] = [
  {
    _id: "demo-1",
    title: "Organic Curve Collection",
    category: "sculpted",
    date: "2025-06-14",
    coverImage: { asset: { _ref: "" } },
    description: "A signature exploration of natural textures. These hand-sculpted pieces were designed to catch light and add movement to minimalist spaces. Perfect for hotel lobby arrangements.",
    clientTestimonial: "Celebration Finds brought our vision to life with textures we didn't think were possible in custom gifting.",
    productsUsed: ["Ribbed Taper", "Textured Vessel", "Custom Seal"],
    gridSpan: "1x2",
  },
  {
    _id: "demo-2",
    title: "The Silver Mist Series",
    category: "luxe",
    date: "2025-11-02",
    coverImage: { asset: { _ref: "" } },
    description: "Cold-pressed metallic finishes paired with deep charcoal pigments. This series was created for a major gala event but transitioned excellently into our permanent luxury wholesale line.",
    productsUsed: ["Metallic Pillar", "Gift Box", "Velvet Insert"],
    gridSpan: "1x1",
  },
  {
    _id: "demo-3",
    title: "Clear & Concise Glassworks",
    category: "minimalist",
    date: "2025-08-20",
    coverImage: { asset: { _ref: "" } },
    description: "Focusing on the beauty of simplicity. High-clarity glass etched with fine lines, designed for brands that value transparency and clean aesthetics.",
    clientTestimonial: "The perfect balance of branding and art. Our partners are still talking about these gifts.",
    productsUsed: ["Etched Glass Vessel", "Monogrammed Tag"],
    gridSpan: "1x1",
  },
  {
    _id: "demo-4",
    title: "Heritage Brand Integration",
    category: "branded",
    date: "2025-09-05",
    coverImage: { asset: { _ref: "" } },
    description: "A comprehensive design suite for a boutique winery. We integrated their century-old logo into laser-engraved keepsakes and custom aromatic blends.",
    productsUsed: ["Engraved Wooden Lid", "Wine-Inspired Scent", "Custom Packaging"],
    gridSpan: "1x1",
  },
];

interface LookbookClientGridProps {
  entries?: PortfolioEntry[];
}

export default function LookbookClientGrid({ entries }: LookbookClientGridProps) {
  const allEntries = entries?.length ? entries : DEMO_ENTRIES;
  const [activeCategory, setActiveCategory] = useState<DesignCategory | "all">("all");
  const { selectedEvent, isOpen, openModal, closeModal } = useEventModal(); // Keeping hook name for now, but conceptualizing as entry

  const filtered = useMemo(() => {
    if (activeCategory === "all") return allEntries;
    return allEntries.filter((e) => e.category === activeCategory);
  }, [allEntries, activeCategory]);

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex items-center gap-6 flex-wrap mb-12">
        {DESIGN_CATEGORY_LIST.map((type) => (
          <button
            key={type}
            onClick={() => setActiveCategory(type)}
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest pb-0.5 transition-all outline-none",
              activeCategory === type
                ? "text-accent border-b-2 border-accent"
                : "text-slate-400 hover:text-slate-700 hover:border-b-2 hover:border-slate-200"
            )}
          >
            {DESIGN_CATEGORY_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Grid */}
      <LayoutGroup>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[320px]">
            {filtered.map((entry) => (
              <PortfolioCard
                key={entry._id}
                event={entry as any} // Typing hack due to shared component naming
                imageUrl={resolveImageUrl(entry)}
                onSelect={openModal}
                spanSize={entry.gridSpan}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
            <p className="font-serif text-2xl text-slate-500">
              No designs recorded for {DESIGN_CATEGORY_LABELS[activeCategory]} yet.
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline"
            >
              Show All Designs
            </button>
          </div>
        )}
      </LayoutGroup>

      {/* Detail modal */}
      <EventDetailModal event={selectedEvent as any} onClose={closeModal} />
    </div>
  );
}
