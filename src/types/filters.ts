// ─── Filter Types ─────────────────────────────────────────────────────────────

export type SortOption = "newest" | "popular" | "price_asc" | "price_desc";

export interface FilterState {
  category: string | null;
  tags: string[];
  priceRange: [number, number];
  sortBy: SortOption;
  searchQuery: string;
  page: number;
}

export type FilterAction =
  | { type: "SET_CATEGORY"; payload: string | null }
  | { type: "TOGGLE_TAG"; payload: string }
  | { type: "SET_PRICE_RANGE"; payload: [number, number] }
  | { type: "SET_SORT"; payload: SortOption }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "RESET_FILTERS"; payload: { priceMin: number; priceMax: number } };

export const DEFAULT_FILTER_STATE: Omit<FilterState, "priceRange"> = {
  category: null,
  tags: [],
  sortBy: "newest",
  searchQuery: "",
  page: 1,
};
