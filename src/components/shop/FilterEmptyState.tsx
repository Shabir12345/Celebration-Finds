"use client";

import { ShoppingBag } from "lucide-react";

interface FilterEmptyStateProps {
  onReset: () => void;
}

export default function FilterEmptyState({ onReset }: FilterEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F5F2EB] flex items-center justify-center">
        <ShoppingBag className="w-7 h-7 text-slate-300" />
      </div>
      <div className="space-y-3 max-w-sm">
        <p className="font-serif text-2xl font-medium text-slate-700">
          Nothing found for these filters.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Try adjusting your search or clearing the active filters to explore all our collections.
        </p>
      </div>
      <button
        onClick={onReset}
        className="px-8 py-4 border border-[#1A4338] text-[#1A4338] text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A4338] hover:text-white transition-all"
      >
        Clear All Filters
      </button>
    </div>
  );
}
