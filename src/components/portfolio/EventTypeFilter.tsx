"use client";

import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

interface EventTypeFilterProps {
  options: FilterOption[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export default function EventTypeFilter({
  options,
  activeId,
  onSelect,
  className,
}: EventTypeFilterProps) {
  return (
    <div className={cn("w-full flex items-center space-x-2 overflow-x-auto no-scrollbar py-4", className)}>
        {/* 'All' option if not in list */}
        {!options.find(o => o.id === 'all') && (
            <button
                onClick={() => onSelect('all')}
                className={cn(
                    "whitespace-nowrap px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border transition-all duration-300",
                    activeId === 'all' 
                        ? "bg-accent text-white border-accent shadow-lg" 
                        : "bg-white text-slate-500 border-slate-100 hover:border-primary hover:text-primary"
                )}
            >
                All Events
            </button>
        )}

      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={cn(
            "whitespace-nowrap px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border transition-all duration-300 flex items-center space-x-2",
            activeId === opt.id 
              ? "bg-accent text-white border-accent shadow-lg" 
              : "bg-white text-slate-500 border-slate-100 hover:border-primary hover:text-primary"
          )}
        >
          <span>{opt.name}</span>
          {opt.count !== undefined && (
            <span className={cn(
                "ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-slate-100 rounded-full text-[9px] font-bold",
                activeId === opt.id ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400"
            )}>
                {opt.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
