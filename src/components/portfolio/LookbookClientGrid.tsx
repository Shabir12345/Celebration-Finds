"use client";

import { useMemo, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { PortfolioEvent, EventType, EVENT_TYPE_LIST, EVENT_TYPE_LABELS } from "@/types/portfolio";
import { useEventModal } from "@/hooks/useEventModal";
import PortfolioCard from "./PortfolioCard";
import EventDetailModal from "./EventDetailModal";
import { cn } from "@/lib/utils";

// Fallback stock images per event type for demo
const FALLBACK_IMAGES: Record<string, string> = {
  wedding:      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80",
  corporate:    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
  birthday:     "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&q=80",
  "baby-shower":"https://images.unsplash.com/photo-1515488042361-ee00e0ddc4a1?auto=format&fit=crop&q=80",
  other:        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80",
};

function resolveImageUrl(event: PortfolioEvent): string {
  if (event.coverImage?.asset?._ref) {
    const ref = event.coverImage.asset._ref
      .replace("image-", "")
      .replace(/-([a-z]+)$/, ".$1");
    return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${ref}`;
  }
  return FALLBACK_IMAGES[event.eventType] ?? FALLBACK_IMAGES["other"];
}

// Demo events shown when no Sanity data
const DEMO_EVENTS: PortfolioEvent[] = [
  {
    _id: "demo-1",
    title: "Sarah & James — Garden Wedding",
    eventType: "wedding",
    date: "2025-06-14",
    coverImage: { asset: { _ref: "" } },
    description: "A soft, romantic summer wedding with 180 guests. Custom scented candles with velvet ribbons in blush and ivory graced every table.",
    clientTestimonial: "The candles were absolutely stunning. Every single guest took theirs home and I've had so many compliments!",
    productsUsed: ["Sculpted Candle", "Velvet Ribbon", "Custom Label"],
    gridSpan: "1x2",
  },
  {
    _id: "demo-2",
    title: "Maple & Co. — Annual Gala",
    eventType: "corporate",
    date: "2025-11-02",
    coverImage: { asset: { _ref: "" } },
    description: "A premium corporate gala for 300 VIP guests. Custom branded gift boxes with laser-engraved items in navy and gold.",
    productsUsed: ["Gift Box", "Engraved Pen", "Custom Insert"],
    gridSpan: "1x1",
  },
  {
    _id: "demo-3",
    title: "Emma's Enchanted Baby Shower",
    eventType: "baby-shower",
    date: "2025-08-20",
    coverImage: { asset: { _ref: "" } },
    description: "A dreamy pastel shower for 60 guests. Mini-candles with seed paper tags and hand-tied bows.",
    clientTestimonial: "Everyone was obsessed with the favours. So thoughtful and beautifully made.",
    productsUsed: ["Mini Candle", "Seed Paper Tag", "Satin Bow"],
    gridSpan: "1x1",
  },
  {
    _id: "demo-4",
    title: "Thompson 50th Birthday Celebration",
    eventType: "birthday",
    date: "2025-09-05",
    coverImage: { asset: { _ref: "" } },
    description: "An elegant milestone birthday dinner for 40 closest friends and family. Monogrammed candles and custom chocolate boxes.",
    productsUsed: ["Monogrammed Candle", "Chocolate Box"],
    gridSpan: "1x1",
  },
];

interface LookbookClientGridProps {
  events?: PortfolioEvent[];
}

export default function LookbookClientGrid({ events }: LookbookClientGridProps) {
  const allEvents = events?.length ? events : DEMO_EVENTS;
  const [activeType, setActiveType] = useState<EventType | "all">("all");
  const { selectedEvent, isOpen, openModal, closeModal } = useEventModal();

  const filtered = useMemo(() => {
    if (activeType === "all") return allEvents;
    return allEvents.filter((e) => e.eventType === activeType);
  }, [allEvents, activeType]);

  return (
    <div>
      {/* Event type filter pills */}
      <div className="flex items-center gap-6 flex-wrap mb-12">
        {EVENT_TYPE_LIST.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest pb-0.5 transition-all",
              activeType === type
                ? "text-[#1A4338] border-b-2 border-[#1A4338]"
                : "text-slate-400 hover:text-slate-700"
            )}
          >
            {EVENT_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <LayoutGroup>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[280px]">
            {filtered.map((event) => (
              <PortfolioCard
                key={event._id}
                event={event}
                imageUrl={resolveImageUrl(event)}
                onSelect={openModal}
                spanSize={event.gridSpan}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
            <p className="font-serif text-2xl text-slate-500">
              Nothing here for {EVENT_TYPE_LABELS[activeType]} yet.
            </p>
            <button
              onClick={() => setActiveType("all")}
              className="text-[10px] font-bold uppercase tracking-widest text-[#1A4338] hover:underline"
            >
              Show All Events
            </button>
          </div>
        )}
      </LayoutGroup>

      {/* Detail modal */}
      <EventDetailModal event={selectedEvent} onClose={closeModal} />
    </div>
  );
}
