import { PricingRule } from "./pricing";

// ─── Field Types ──────────────────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "color_swatch"
  | "scent_selector"
  | "photo_upload"
  | "dropdown"
  | "ribbon_selector"
  | "quantity_picker";

export interface FieldOption {
  value: string;
  label: string;
  icon?: string;           // emoji or icon slug
  priceModifier?: number;  // +$X added to unit price when selected
  hexColor?: string;       // explicit hex for color swatches
  stockAvailable?: boolean; // false = show strikethrough
}

export interface SchemaField {
  field_key: string;
  field_type: FieldType;
  label: string;
  description?: string;    // helper text beneath label
  placeholder?: string;
  is_required: boolean;
  options?: FieldOption[];
  validation?: {
    max_length?: number;
    min_length?: number;
    max_size_mb?: number;       // for photo_upload
    allowed_types?: string[];   // e.g. ['image/jpeg', 'image/png']
    pattern?: string;           // regex pattern
    pattern_message?: string;   // user-facing message
  };
  default_value?: string | null;
  helper_text?: string;
  display_order: number;
  dependent_on?: {             // conditional: only show if field_key === value
    field_key: string;
    value: string;
  };
}

export interface CustomizationSchema {
  schema_id: string;
  product_id: string;
  product_type: string;
  fields: SchemaField[];
  pricing_rules?: PricingRule[];
}

// ─── Wizard State ─────────────────────────────────────────────────────────────

export type WizardStatus =
  | "idle"
  | "stepActive"
  | "summaryReview"
  | "submitting"
  | "success"
  | "error";

export type WizardFieldValue = string | number | null;

export interface UploadedFile {
  file: File;
  previewUrl: string;
  uploadStatus: "pending" | "uploading" | "done" | "error";
  uploadedUrl?: string;
}

export interface WizardState {
  status: WizardStatus;
  currentStep: number;
  values: Record<string, WizardFieldValue>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  uploadedFiles: Record<string, UploadedFile>;
}

// ─── Wizard Actions ───────────────────────────────────────────────────────────

export type WizardAction =
  | { type: "SET_VALUE"; key: string; val: WizardFieldValue }
  | { type: "SET_ERROR"; key: string; message: string }
  | { type: "CLEAR_ERROR"; key: string }
  | { type: "SET_TOUCHED"; key: string }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "SET_STATUS"; status: WizardStatus }
  | { type: "SET_UPLOAD"; key: string; file: UploadedFile }
  | { type: "RESET" };

// ─── Mock Schemas ─────────────────────────────────────────────────────────────

export const MOCK_CANDLE_SCHEMA: CustomizationSchema = {
  schema_id: "candle-v1",
  product_id: "wedding-favour-candle",
  product_type: "candle",
  fields: [
    {
      field_key: "label_text",
      field_type: "text",
      label: "Type Your Names",
      description: "This will be printed on your candle label.",
      placeholder: "e.g. Sarah & Mark · June 2025",
      is_required: true,
      validation: { max_length: 40 },
      display_order: 1,
    },
    {
      field_key: "ribbon_color",
      field_type: "color_swatch",
      label: "Pick Your Velvet Ribbon Color",
      is_required: true,
      options: [
        { value: "#F5F0EB", label: "Warm Ivory", hexColor: "#F5F0EB", stockAvailable: true },
        { value: "#D4B8C7", label: "Soft Pink", hexColor: "#D4B8C7", stockAvailable: true },
        { value: "#5D3754", label: "Deep Berry", hexColor: "#5D3754", stockAvailable: true },
        { value: "#2D4B3F", label: "Forest Green", hexColor: "#2D4B3F", stockAvailable: true },
        { value: "#1C2A3A", label: "Midnight Navy", hexColor: "#1C2A3A", stockAvailable: true },
      ],
      display_order: 2,
    },
    {
      field_key: "scent",
      field_type: "scent_selector",
      label: "Create Your Scent",
      placeholder: "Fresh Flowers or Warm Woods?",
      is_required: true,
      options: [
        { value: "vanilla", label: "Warm Vanilla", icon: "🍦" },
        { value: "peony", label: "Fresh Peony", icon: "🌸" },
        { value: "wood", label: "Cedar Wood", icon: "🌲" },
        { value: "jasmine", label: "Jasmine Bloom", icon: "🌺" },
        { value: "citrus", label: "Bright Citrus", icon: "🍋" },
        { value: "amber", label: "Warm Amber", icon: "🟠" },
      ],
      display_order: 3,
    },
  ],
  pricing_rules: [
    {
      rule_id: "pr-1",
      type: "quantity_tier",
      amount: 0,
      min_qty: 25,
      discount_pct: 5,
    },
    {
      rule_id: "pr-2",
      type: "quantity_tier",
      amount: 0,
      min_qty: 50,
      discount_pct: 10,
    },
    {
      rule_id: "pr-3",
      type: "quantity_tier",
      amount: 0,
      min_qty: 100,
      discount_pct: 15,
    },
  ],
};
