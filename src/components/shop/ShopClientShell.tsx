"use client";

import React, { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShopFilters } from "@/hooks/useShopFilters";
import FilterBar from "./FilterBar";
import FilterEmptyState from "./FilterEmptyState";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SanityProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category?: string;
  tags?: string[];
  images?: string[];
  description?: string;
  createdAt?: string;
}

interface ShopClientShellProps {
  products: SanityProduct[];
}

function ShopClientShellInner({ products }: ShopClientShellProps) {
  const {
    filterState,
    dispatch,
    paginatedProducts,
    totalPages,
    priceMin,
    priceMax,
    activeFilterCount,
    hasResults,
    reset,
  } = useShopFilters(products);

  return (
    <div>
      {/* Filter bar */}
      <FilterBar
        state={filterState}
        dispatch={dispatch}
        priceMin={priceMin}
        priceMax={priceMax}
        activeFilterCount={activeFilterCount}
        onReset={reset}
      />

      {/* Results count */}
      {hasResults && (
        <div className="container mx-auto px-4 md:px-6 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
            {paginatedProducts.length} result{paginatedProducts.length !== 1 ? "s" : ""}
            {filterState.category ? ` in ${filterState.category}` : ""}
          </p>
        </div>
      )}

      {/* Grid */}
      <section className="py-16 container mx-auto px-4 md:px-6 min-h-[500px]">
        {hasResults ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${filterState.category}-${filterState.sortBy}-${filterState.page}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
            >
              {paginatedProducts.map((product, index) => {
                const isPromoPosition = index === 3;
                return (
                  <React.Fragment key={product._id}>
                    {isPromoPosition && filterState.page === 1 && (
                      <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] p-8 flex flex-col justify-center items-start overflow-hidden relative min-h-[400px] group shadow-inner">
                        <div className="absolute top-0 right-0 w-[150%] h-full bg-gradient-to-r from-[var(--color-brand-blush)]/10 to-[var(--color-accent-gold)]/10 -skew-x-12 transform translate-x-1/2 group-hover:translate-x-1/3 luxury-transition duration-1000" />
                        <div className="relative z-10 w-full pl-4 md:pl-8">
                           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-emerald)] block mb-3">Partnerships</span>
                           <h3 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4 max-w-sm tracking-tight leading-none">Volume Gifting & Corporate Accounts</h3>
                           <p className="font-sans text-sm text-[var(--color-text-secondary)] mb-8 max-w-sm leading-relaxed font-light">Let us curate perfect moments for your clients or employees.</p>
                           <a href="/wholesale" className="inline-block px-8 py-4 bg-[var(--color-text-primary)] text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[var(--color-accent-gold)] luxury-transition shadow-xl hover:-translate-y-1">Apply Now</a>
                        </div>
                      </div>
                    )}
                    <ProductCard
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      image={
                        product.images?.[0] ??
                        "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80"
                      }
                      category={product.category ?? ""}
                      slug={product.slug}
                    />
                  </React.Fragment>
                );
              })}
            </motion.div>
          </AnimatePresence>
        ) : (
          <FilterEmptyState onReset={reset} />
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="container mx-auto px-4 md:px-6 pb-20 flex items-center justify-center gap-3">
          <button
            disabled={filterState.page <= 1}
            onClick={() => dispatch({ type: "SET_PAGE", payload: filterState.page - 1 })}
            className="p-2 border border-[var(--color-border-subtle)] text-[var(--color-text-tertiary)] hover:border-[var(--color-accent-emerald)] hover:text-[var(--color-accent-emerald)] disabled:opacity-30 disabled:pointer-events-none luxury-transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => dispatch({ type: "SET_PAGE", payload: idx + 1 })}
              className={`w-9 h-9 text-xs font-bold border luxury-transition ${
                filterState.page === idx + 1
                  ? "bg-[var(--color-accent-navy)] text-white border-[var(--color-accent-navy)]"
                  : "border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-emerald)] hover:text-[var(--color-accent-emerald)]"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            disabled={filterState.page >= totalPages}
            onClick={() => dispatch({ type: "SET_PAGE", payload: filterState.page + 1 })}
            className="p-2 border border-[var(--color-border-subtle)] text-[var(--color-text-tertiary)] hover:border-[var(--color-accent-emerald)] hover:text-[var(--color-accent-emerald)] disabled:opacity-30 disabled:pointer-events-none luxury-transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// Wrapped in Suspense because useSearchParams() requires it in Next.js
export default function ShopClientShell({ products }: ShopClientShellProps) {
  return (
    <Suspense>
      <ShopClientShellInner products={products} />
    </Suspense>
  );
}
