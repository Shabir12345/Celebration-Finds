"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { shakeVariants } from "@/lib/motion";
import { FieldOption } from "@/types/customization";

interface RibbonSelectorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: FieldOption[];
  required?: boolean;
  error?: string;
  description?: string;
}

export default function RibbonSelector({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  description,
}: RibbonSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {label} {required && <span className="text-primary">*</span>}
        </label>
        {description && (
          <p className="text-[11px] text-slate-400 font-medium">{description}</p>
        )}
      </div>

      <motion.div
        className="space-y-3"
        animate={error ? "shake" : ""}
        variants={shakeVariants}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {options.map((opt) => {
            const isSelected = value === opt.value;
            const isOutOfStock = opt.stockAvailable === false;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => !isOutOfStock && onChange(opt.value)}
                disabled={isOutOfStock}
                aria-pressed={isSelected}
                className={cn(
                  "relative px-4 py-4 border text-center transition-all duration-200 group",
                  isSelected
                    ? "border-[#1A4338] bg-[#1A4338] text-white shadow-md"
                    : "border-slate-200 bg-[#F5F2EB] text-slate-600 hover:border-slate-400 hover:bg-white",
                  isOutOfStock && "opacity-40 cursor-not-allowed"
                )}
              >
                {opt.icon && (
                  <span
                    className={cn(
                      "block text-xl mb-2 transition-transform duration-300",
                      !isSelected && "group-hover:scale-110"
                    )}
                  >
                    {opt.icon}
                  </span>
                )}
                <span className="block text-[11px] font-bold uppercase tracking-widest">
                  {opt.label}
                </span>
                {opt.priceModifier && opt.priceModifier > 0 && (
                  <span
                    className={cn(
                      "block text-[10px] font-medium mt-1",
                      isSelected ? "text-white/70" : "text-slate-400"
                    )}
                  >
                    +${opt.priceModifier}
                  </span>
                )}
                {isOutOfStock && (
                  <span className="absolute top-1 right-1 text-[9px] font-bold text-slate-400 uppercase">
                    Sold out
                  </span>
                )}
              </button>
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
