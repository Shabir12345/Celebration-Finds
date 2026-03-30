"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { shakeVariants } from "@/lib/motion";
import { FieldOption } from "@/types/customization";

interface DropdownSelectorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  options: FieldOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  description?: string;
}

export default function DropdownSelector({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Select an option",
  required = false,
  error,
  description,
}: DropdownSelectorProps) {
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
        className="relative"
        animate={error ? "shake" : ""}
        variants={shakeVariants}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(
            "w-full appearance-none bg-white border px-4 py-4 pr-10 text-sm font-medium outline-none transition-all cursor-pointer",
            value ? "text-slate-800" : "text-slate-400",
            error
              ? "border-red-400 focus:border-red-500 ring-1 ring-red-200"
              : "border-slate-200 focus:border-[#1A4338] focus:ring-1 focus:ring-[#1A4338]/20"
          )}
          aria-invalid={!!error}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.stockAvailable === false}
            >
              {opt.label}
              {opt.priceModifier && opt.priceModifier > 0 ? ` (+$${opt.priceModifier})` : ""}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-medium text-red-500 mt-2"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
