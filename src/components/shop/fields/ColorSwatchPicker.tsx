"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { shakeVariants } from "@/lib/motion";
import { FieldOption } from "@/types/customization";

interface ColorSwatchPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: FieldOption[];
  required?: boolean;
  error?: string;
  description?: string;
}

export default function ColorSwatchPicker({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  description,
}: ColorSwatchPickerProps) {
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="space-y-3">
      {/* Label row */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
            {label} {required && <span className="text-primary">*</span>}
          </label>
          {description && (
            <p className="text-[11px] text-slate-400 font-medium">{description}</p>
          )}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {selectedOption?.label || "None selected"}
        </span>
      </div>

      {/* Swatches */}
      <motion.div
        className="space-y-3"
        animate={error ? "shake" : ""}
        variants={shakeVariants}
      >
        <div className="flex flex-wrap gap-4" role="radiogroup" aria-label={label}>
          {options.map((opt) => {
            const isSelected = value === opt.value;
            const isOutOfStock = opt.stockAvailable === false;

            return (
              <div key={opt.value} className="relative group">
                {/* Hidden radio for accessibility */}
                <input
                  type="radio"
                  name={label}
                  value={opt.value}
                  checked={isSelected}
                  onChange={() => !isOutOfStock && onChange(opt.value)}
                  className="sr-only"
                  aria-label={opt.label}
                  disabled={isOutOfStock}
                />

                <button
                  type="button"
                  onClick={() => !isOutOfStock && onChange(opt.value)}
                  disabled={isOutOfStock}
                  title={isOutOfStock ? `${opt.label} (out of stock)` : opt.label}
                  aria-pressed={isSelected}
                  className={cn(
                    "w-12 h-12 rounded-full border-2 transition-all duration-200 relative",
                    isSelected
                      ? "border-[#1A4338] scale-110 shadow-md ring-2 ring-offset-2 ring-[#1A4338]"
                      : "border-slate-200 hover:scale-110 hover:shadow-md",
                    isOutOfStock && "opacity-40 cursor-not-allowed"
                  )}
                >
                  {/* Swatch fill */}
                  <div
                    className="w-full h-full rounded-full shadow-inner"
                    style={{ backgroundColor: opt.hexColor || opt.value }}
                  />

                  {/* Out of stock diagonal line */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-400 rotate-45 origin-center" />
                    </div>
                  )}

                  {/* Selected checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow">
                        <Check className="w-3 h-3 text-[#1A4338] stroke-[3]" />
                      </span>
                    </motion.div>
                  )}
                </button>

                {/* Tooltip label on hover */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {opt.label}
                </span>
              </div>
            );
          })}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-medium text-red-500"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
