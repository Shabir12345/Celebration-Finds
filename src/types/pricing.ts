// ─── Pricing Types ────────────────────────────────────────────────────────────

export interface PricingRule {
  rule_id: string;
  /** field_option_modifier: adds $ when a specific option is chosen */
  type: "field_option_modifier" | "quantity_tier" | "flat_fee";

  // Used by field_option_modifier
  field_key?: string;
  option_value?: string;
  amount: number;

  // Used by quantity_tier
  min_qty?: number;
  discount_pct?: number; // e.g. 10 = 10% off
}

export interface PricingModifier {
  label: string;
  amount: number; // positive = surcharge, negative = discount
}

export interface PricingResult {
  basePrice: number;
  modifiers: PricingModifier[];
  quantityDiscount?: PricingModifier;
  subtotal: number;   // unitPrice × quantity
  unitPrice: number;  // basePrice + all modifiers
  total: number;      // subtotal − quantityDiscount
  quantity: number;
}
