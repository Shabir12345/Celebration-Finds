"use client";

import { useReducer, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterState, FilterAction, SortOption, DEFAULT_FILTER_STATE } from "@/types/filters";

// ─── Reducer ──────────────────────────────────────────────────────────────────

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, category: action.payload, page: 1 };
    case "TOGGLE_TAG":
      return {
        ...state,
        tags: state.tags.includes(action.payload)
          ? state.tags.filter((t) => t !== action.payload)
          : [...state.tags, action.payload],
        page: 1,
      };
    case "SET_PRICE_RANGE":
      return { ...state, priceRange: action.payload, page: 1 };
    case "SET_SORT":
      return { ...state, sortBy: action.payload, page: 1 };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "RESET_FILTERS":
      return {
        ...DEFAULT_FILTER_STATE,
        priceRange: [action.payload.priceMin, action.payload.priceMax],
      };
    default:
      return state;
  }
}

// ─── Product type (minimal) ───────────────────────────────────────────────────

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

// ─── Filter + sort logic ──────────────────────────────────────────────────────

function applyFilters(products: SanityProduct[], state: FilterState): SanityProduct[] {
  let result = [...products];

  if (state.category) {
    result = result.filter((p) =>
      p.category?.toLowerCase() === state.category?.toLowerCase()
    );
  }

  if (state.tags.length > 0) {
    result = result.filter((p) =>
      state.tags.some((tag) =>
        p.tags?.some((pt) => pt.toLowerCase() === tag.toLowerCase())
      )
    );
  }

  const [minP, maxP] = state.priceRange;
  result = result.filter((p) => p.price >= minP && p.price <= maxP);

  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }

  switch (state.sortBy) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result.sort((a, b) =>
        (b.createdAt ?? "").localeCompare(a.createdAt ?? "")
      );
      break;
    // "popular" — keep original order
  }

  return result;
}

const PAGE_SIZE = 12;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useShopFilters(products: SanityProduct[]) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceMin = products.length ? Math.min(...products.map((p) => p.price)) : 0;
  const priceMax = products.length ? Math.max(...products.map((p) => p.price)) : 500;

  const [filterState, dispatch] = useReducer(filterReducer, {
    ...DEFAULT_FILTER_STATE,
    // Initialise from URL params if present
    category: searchParams.get("category") ?? null,
    sortBy: (searchParams.get("sort") as SortOption) ?? "newest",
    searchQuery: searchParams.get("q") ?? "",
    priceRange: [priceMin, priceMax],
  });

  // Sync filters → URL (debounce not needed, router.replace is async)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filterState.category) params.set("category", filterState.category);
    if (filterState.sortBy !== "newest") params.set("sort", filterState.sortBy);
    if (filterState.searchQuery) params.set("q", filterState.searchQuery);
    if (filterState.page > 1) params.set("page", String(filterState.page));

    const query = params.toString();
    router.replace(query ? `?${query}` : window.location.pathname, { scroll: false });
  }, [filterState, router]);

  const filteredProducts = useMemo(
    () => applyFilters(products, filterState),
    [products, filterState]
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice(
    (filterState.page - 1) * PAGE_SIZE,
    filterState.page * PAGE_SIZE
  );

  const activeFilterCount =
    (filterState.category ? 1 : 0) +
    filterState.tags.length +
    (filterState.searchQuery ? 1 : 0);

  const reset = useCallback(() => {
    dispatch({ type: "RESET_FILTERS", payload: { priceMin, priceMax } });
  }, [priceMin, priceMax]);

  return {
    filterState,
    dispatch,
    filteredProducts,
    paginatedProducts,
    totalPages,
    priceMin,
    priceMax,
    activeFilterCount,
    hasResults: filteredProducts.length > 0,
    reset,
  };
}
