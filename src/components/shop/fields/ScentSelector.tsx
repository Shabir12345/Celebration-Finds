"use client";

import { cn } from "@/lib/utils";

interface ScentSelectorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string; icon?: string }[];
  required?: boolean;
}

export default function ScentSelector({
  label,
  value,
  onChange,
  options,
  required = false,
}: ScentSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {label} {required && <span className="text-primary">*</span>}
        </label>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {options.find(o => o.value === value)?.label || "No scent selected"}
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "p-4 bg-muted rounded-md border text-center flex flex-col items-center justify-center space-y-2 transition-all group hover:bg-white hover:shadow-xl",
              value === opt.value ? "border-primary shadow-lg bg-white bg-opacity-100" : "border-slate-100 bg-opacity-50"
            )}
            aria-pressed={value === opt.value}
          >
            <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
               {opt.icon || "💨"}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">
               {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
