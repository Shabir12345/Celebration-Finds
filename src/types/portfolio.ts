// ─── Portfolio / Lookbook Types ───────────────────────────────────────────────

export type EventType = "wedding" | "corporate" | "birthday" | "baby-shower" | "other";

export interface PortfolioEvent {
  _id: string;
  title: string;
  eventType: EventType;
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

export const EVENT_TYPE_LABELS: Record<EventType | "all", string> = {
  all:          "All Events",
  wedding:      "Weddings",
  corporate:    "Corporate",
  birthday:     "Birthdays",
  "baby-shower": "Baby Showers",
  other:        "Other",
};

export const EVENT_TYPE_LIST: Array<EventType | "all"> = [
  "all", "wedding", "corporate", "birthday", "baby-shower",
];
