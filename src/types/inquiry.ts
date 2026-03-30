// ─── Inquiry / Partnership Form Types ─────────────────────────────────────────

export type InquiryType = "wholesale" | "bulk_order" | "collaboration" | "general";

export interface InquiryFormData {
  // Step 1 — shown for all types
  type: InquiryType;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;

  // Step 2 — conditional on type
  eventType?: string;
  estimatedGuestCount?: number;
  eventDate?: string;
  projectDescription?: string;

  // Step 3 — conditional
  budgetRange?: string;
  timeline?: string;
  howDidYouHear?: string;
  additionalNotes?: string;
}

/** Defines which optional fields are visible per inquiry type */
export const VISIBLE_FIELDS: Record<InquiryType, (keyof InquiryFormData)[]> = {
  wholesale:     ["company", "eventType", "estimatedGuestCount", "eventDate", "budgetRange", "timeline"],
  bulk_order:    ["eventType", "estimatedGuestCount", "eventDate", "budgetRange"],
  collaboration: ["company", "projectDescription", "timeline"],
  general:       ["projectDescription"],
};

export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  wholesale:     "Wholesale",
  bulk_order:    "Bulk Order",
  collaboration: "Collaboration",
  general:       "General Enquiry",
};

export const BUDGET_RANGES = [
  "Under $500",
  "$500 – $1,500",
  "$1,500 – $5,000",
  "$5,000 – $15,000",
  "$15,000+",
];

export const TIMELINES = [
  "Less than 1 month",
  "1–2 months",
  "3–6 months",
  "6+ months",
  "Not sure yet",
];

export const HOW_DID_YOU_HEAR = [
  "Instagram",
  "Pinterest",
  "Google search",
  "Word of mouth",
  "Wedding planner referral",
  "Other",
];
