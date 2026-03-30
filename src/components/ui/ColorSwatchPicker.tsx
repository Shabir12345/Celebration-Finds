"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Swatch {
  id: string;
  name: string;
  hexCode: string; // The literal hex color for the swatch fill
  outOfStock?: boolean;
}

export interface ColorSwatchPickerProps {
  swatches: Swatch[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  size?: "sm" | "lg";
}

export const ColorSwatchPicker: React.FC<ColorSwatchPickerProps> = ({
  swatches,
  selectedId,
  onSelect,
  size = "lg",
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      {swatches.map((swatch) => {
        const isSelected = selectedId === swatch.id;
        const isDisabled = swatch.outOfStock;

        return (
          <div key={swatch.id} className="relative group flex flex-col items-center">
            {/* Hidden native radio for accessibility */}
            <input
              type="radio"
              name="color-swatch-picker"
              className="sr-only"
              value={swatch.id}
              checked={isSelected}
              disabled={isDisabled}
              onChange={() => !isDisabled && onSelect(swatch.id)}
              aria-label={swatch.name}
            />
            {/* Visible Swatch UI */}
            <motion.button
              type="button"
              onClick={() => !isDisabled && onSelect(swatch.id)}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.1 } : {}}
              whileTap={!isDisabled ? { scale: 0.9 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={cn(
                "relative rounded-full block luxury-transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-emerald)] shadow-sm",
                size === "sm" ? "w-6 h-6" : "w-8 h-8",
                isSelected ? "ring-2 ring-offset-2 ring-[var(--color-accent-emerald)]" : "",
                isDisabled ? "opacity-40 saturate-0 cursor-not-allowed" : "cursor-pointer",
              )}
              style={{ backgroundColor: swatch.hexCode }}
            >
              {isDisabled && (
                <span className="absolute inset-0 block rounded-full border border-[var(--color-border-subtle)]" />
              )}
            </motion.button>
            
            {/* Tooltip Title */}
            <span
              className="absolute -bottom-6 opacity-0 group-hover:opacity-100 luxury-transition text-micro text-[var(--color-text-secondary)] whitespace-nowrap pointer-events-none"
            >
              {swatch.name}{isDisabled && " (Sold Out)"}
            </span>
          </div>
        );
      })}
    </div>
  );
};
