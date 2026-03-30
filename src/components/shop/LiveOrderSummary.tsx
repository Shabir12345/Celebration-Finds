"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SchemaField } from "@/types/customization";
import { PricingResult } from "@/types/pricing";
import { fadeVariants } from "@/lib/motion";
import Image from "next/image";

interface LiveOrderSummaryProps {
  productName: string;
  productImage?: string;
  fields: SchemaField[];
  values: Record<string, any>;
  pricing: PricingResult;
}

export default function LiveOrderSummary({
  productName,
  productImage,
  fields,
  values,
  pricing,
}: LiveOrderSummaryProps) {
  const selections = useMemo(() => {
    return fields
      .map((field) => {
        const val = values[field.field_key];
        if (!val) return null;

        let displayValue: string = String(val);
        if (
          ["color_swatch", "scent_selector", "ribbon_selector", "dropdown"].includes(
            field.field_type
          )
        ) {
          const opt = field.options?.find((o) => o.value === val);
          displayValue = opt?.label ?? displayValue;
        }

        // For photo uploads just show a thumbnail placeholder label
        if (field.field_type === "photo_upload") {
          displayValue = "Photo added ✓";
        }

        return { label: field.label, value: displayValue, key: field.field_key };
      })
      .filter(Boolean) as { label: string; value: string; key: string }[];
  }, [fields, values]);

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      {/* Product image thumbnail */}
      {productImage && (
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 rounded-sm">
          <Image
            src={productImage}
            alt={productName}
            fill
            sizes="380px"
            className="object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="space-y-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">
          Your Selection
        </p>
        <h3 className="font-serif text-xl font-medium text-slate-800 leading-snug">
          {productName}
        </h3>
      </div>

      {/* Customisation line items */}
      <div className="flex-grow space-y-4 overflow-y-auto">
        <AnimatePresence>
          {selections.length > 0 ? (
            selections.map((s) => (
              <motion.div
                key={s.key}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-0.5"
              >
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  {s.label}
                </p>
                <p className="text-sm font-medium text-slate-700 italic leading-snug">
                  {s.value}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-xs text-slate-300 font-medium italic">
              Your selections will appear here…
            </p>
          )}
        </AnimatePresence>
      </div>

      {/* Price breakdown */}
      <div className="space-y-3 pt-5 border-t border-slate-200">
        {/* Base price */}
        <div className="flex justify-between text-xs text-slate-500">
          <span className="font-medium">Base price</span>
          <span>${pricing.basePrice.toFixed(2)} / item</span>
        </div>

        {/* Option modifiers */}
        <AnimatePresence>
          {pricing.modifiers.map((mod) => (
            <motion.div
              key={mod.label}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex justify-between text-xs text-slate-500"
            >
              <span className="font-medium">{mod.label}</span>
              <span className="text-[#1A4338]">+${mod.amount.toFixed(2)}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Quantity discount */}
        {pricing.quantityDiscount && (
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-between text-xs"
          >
            <span className="text-green-700 font-medium">{pricing.quantityDiscount.label}</span>
            <span className="text-green-700">
              −${Math.abs(pricing.quantityDiscount.amount).toFixed(2)}
            </span>
          </motion.div>
        )}

        {/* Divider */}
        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Total ({pricing.quantity} items)
            </span>
            <motion.span
              key={pricing.total}
              initial={{ opacity: 0.5, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="font-serif text-2xl font-medium text-slate-800"
            >
              ${pricing.total.toFixed(2)}
            </motion.span>
          </div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">
            ${pricing.unitPrice.toFixed(2)} per item · 25 item minimum
          </p>
        </div>
      </div>
    </div>
  );
}
