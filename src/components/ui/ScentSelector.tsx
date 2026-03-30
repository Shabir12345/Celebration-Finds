"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Leaf, Droplet, Wind, Flame } from "lucide-react"; // Sample icons mapping to families

export type ScentFamily = "woodsy" | "floral" | "fresh" | "warm";

const ScentIcons: Record<ScentFamily, React.ElementType> = {
  woodsy: Leaf,
  floral: Droplet, // Or a flower icon custom SVG
  fresh: Wind,
  warm: Flame,
};

export interface Scent {
  id: string;
  name: string;
  family: ScentFamily;
  description?: string;
}

export interface ScentSelectorProps {
  scents: Scent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  layout?: "grid" | "list";
}

export const ScentSelector: React.FC<ScentSelectorProps> = ({
  scents,
  selectedId,
  onSelect,
  layout = "grid",
}) => {
  return (
    <div
      className={cn(
        "gap-4",
        layout === "grid" ? "grid grid-cols-2 md:grid-cols-3" : "flex flex-col w-full"
      )}
    >
      {scents.map((scent) => {
        const isSelected = selectedId === scent.id;
        const Icon = ScentIcons[scent.family];

        return (
          <motion.div
            key={scent.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "relative cursor-pointer rounded-md p-4 luxury-transition border",
              isSelected 
                ? "bg-[var(--color-brand-blush)] border-[var(--color-brand-blush)] text-[var(--color-text-primary)]" 
                : "bg-[var(--color-bg-secondary)] border-[var(--color-border-subtle)] hover:border-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
            )}
            onClick={() => onSelect(scent.id)}
          >
            {/* Hidden accessibility input */}
            <input
              type="radio"
              name="scent-selector"
              className="sr-only"
              value={scent.id}
              checked={isSelected}
              onChange={() => onSelect(scent.id)}
              aria-label={scent.name}
            />

            <div className="flex items-start space-x-3">
              <div 
                className={cn(
                  "p-2 rounded-full",
                  isSelected ? "bg-white/40" : "bg-[var(--color-bg-primary)]"
                )}
              >
                <Icon className={cn("w-4 h-4", isSelected ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]")} />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans font-semibold text-ui leading-tight">{scent.name}</span>
                {scent.description && (
                  <span className={cn(
                    "font-sans text-micro mt-1",
                    isSelected ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]" 
                  )}>
                    {scent.description}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
