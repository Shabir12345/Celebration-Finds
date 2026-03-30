"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterState, FilterAction, SortOption } from "@/types/filters";

const CATEGORIES = ["Wedding Favours", "Baby Shower", "Corporate Gifting", "Seasonal Gifts"];
const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Newest",       value: "newest" },
  { label: "Most Popular", value: "popular" },
  { label: "Price: Low–High", value: "price_asc" },
  { label: "Price: High–Low", value: "price_desc" },
];

interface FilterBarProps {
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
  priceMin: number;
  priceMax: number;
  activeFilterCount: number;
  onReset: () => void;
}

export default function FilterBar({
  state,
  dispatch,
  priceMin,
  priceMax,
  activeFilterCount,
  onReset,
}: FilterBarProps) {
  const [searchVal, setSearchVal] = useState(state.searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  const handleSearch = useCallback(
    (val: string) => {
      setSearchVal(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        dispatch({ type: "SET_SEARCH", payload: val });
      }, 300);
    },
    [dispatch]
  );

  useEffect(() => {
    // Sync if external reset clears search
    if (!state.searchQuery) setSearchVal("");
  }, [state.searchQuery]);

  return (
    <div className="space-y-0">
      {/* ── Category Pills ────────────────────────────────────────────────────── */}
      <div className="sticky top-[72px] z-30 bg-[var(--color-bg-primary)]/90 backdrop-blur-md border-b border-[var(--color-border-subtle)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-8 py-5 overflow-x-auto no-scrollbar">
            {/* "All" pill */}
            <button
              onClick={() => dispatch({ type: "SET_CATEGORY", payload: null })}
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest shrink-0 pb-0.5 transition-all luxury-transition",
                !state.category
                  ? "text-[var(--color-accent-emerald)] border-b-2 border-[var(--color-accent-emerald)]"
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              All Products
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  dispatch({
                    type: "SET_CATEGORY",
                    payload: state.category === cat ? null : cat,
                  })
                }
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest shrink-0 pb-0.5 transition-all luxury-transition",
                  state.category === cat
                    ? "text-[var(--color-accent-emerald)] border-b-2 border-[var(--color-accent-emerald)]"
                    : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search + Sort row ────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-6 py-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)] pointer-events-none" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search gifts…"
              className="w-full h-11 pl-10 pr-4 border border-[var(--color-border-subtle)] bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent-emerald)] focus:ring-1 focus:ring-[var(--color-accent-emerald)]/20 transition-all font-serif"
            />
            {searchVal && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={state.sortBy}
              onChange={(e) =>
                dispatch({ type: "SET_SORT", payload: e.target.value as SortOption })
              }
              className="h-11 pl-4 pr-10 border border-[var(--color-border-subtle)] bg-transparent text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-accent-emerald)] appearance-none cursor-pointer transition-all"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)] pointer-events-none" />
          </div>

          {/* Clear filters (only shown when active) */}
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 h-11 px-5 border border-dashed border-[var(--color-border-subtle)] text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] hover:border-red-400 hover:text-[var(--color-status-error)] transition-all shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              Clear{" "}
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-[9px]">
                {activeFilterCount}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
