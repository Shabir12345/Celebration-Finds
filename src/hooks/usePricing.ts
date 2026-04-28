"use client";

import { useMemo } from "react";
import { PricingRule, PricingResult, PricingModifier } from "@/types/pricing";
import { WizardFieldValue } from "@/types/customization";

/**
 * Pure pricing computation — no async, no side effects.
 * Recalculates instantly whenever values or quantity changes.
 */
export function usePricing(
  basePrice: number,
  values: Record<string, WizardFieldValue>,
  quantity: number,
  rules: PricingRule[] = []
): PricingResult {
  return useMemo(() => {
    // 1. Collect field-option modifiers
    const modifiers: PricingModifier[] = [];
    for (const rule of rules) {
      if (rule.type === "field_option_modifier" && rule.field_key) {
        if (values[rule.field_key] === rule.option_value) {
          modifiers.push({
            label: `${rule.option_value} upgrade`,
            amount: rule.amount,
          });
        }
      }
    }

    const unitPrice = (basePrice || 0) + modifiers.reduce((sum, m) => sum + (m.amount || 0), 0);
    const subtotal = Math.max(0, unitPrice * quantity);

    // 2. Find best applicable quantity-tier discount
    const tierRule = rules
      .filter((r) => r.type === "quantity_tier" && quantity >= (r.min_qty ?? 0))
      .sort((a, b) => (b.min_qty ?? 0) - (a.min_qty ?? 0))[0];

    const discountAmount = tierRule ? subtotal * ((tierRule.discount_pct ?? 0) / 100) : 0;

    return {
      basePrice: basePrice || 0,
      modifiers: modifiers.map(m => ({ ...m, amount: m.amount || 0 })),
      quantity: quantity || 0,
      unitPrice: unitPrice || 0,
      subtotal: subtotal || 0,
      quantityDiscount: tierRule
        ? {
            label: `${tierRule.discount_pct}% bulk discount (${tierRule.min_qty}+ items)`,
            amount: -discountAmount,
          }
        : undefined,
      total: Math.max(0, subtotal - discountAmount),
    };
  }, [basePrice, values, quantity, rules]);
}
