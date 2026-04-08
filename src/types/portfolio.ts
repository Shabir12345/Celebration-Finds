// ─── Portfolio / Design Types ───────────────────────────────────────────────

export type DesignCategory = "sculpted" | "minimalist" | "luxe" | "branded" | "other";

export interface PortfolioEntry {
  _id: string;
  title: string;
  category: DesignCategory;
  date: string;            // ISO date string
  coverImage: {
    asset: { _ref: string };
    alt?: string;
  };
  galleryImages?: Array<{
    asset: { _ref: string };
    alt?: string;
  }>;
  description: string;
  clientTestimonial?: string;
  productsUsed?: string[];
  gridSpan?: "1x1" | "1x2" | "2x2"; // editorial layout hint
  slug?: { current: string };
}

export const DESIGN_CATEGORY_LABELS: Record<DesignCategory | "all", string> = {
  all:          "All Designs",
  sculpted:     "Sculpted & Organic",
  minimalist:   "Minimalist & Clean",
  luxe:         "Luxury & Metallic",
  branded:      "Corporate & Branded",
  other:        "Other Styles",
};

export const DESIGN_CATEGORY_LIST: Array<DesignCategory | "all"> = [
  "all", "sculpted", "minimalist", "luxe", "branded",
];
