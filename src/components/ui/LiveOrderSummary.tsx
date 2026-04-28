"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export interface LineItem {
  id: string;
  name: string;
  value: string; // E.g., "Blush Pink", "Lavender Woods"
  priceAdded?: number; // Surcharge
}

export interface LiveOrderSummaryProps {
  basePrice: number;
  productName: string;
  selections: LineItem[];
  currencySymbol?: string;
  onContinue: () => void;
  isContinuing?: boolean;
  className?: string;
}

export const LiveOrderSummary: React.FC<LiveOrderSummaryProps> = ({
  basePrice,
  productName,
  selections,
  currencySymbol = "$",
  onContinue,
  isContinuing = false,
  className,
}) => {
  const totalPrice = selections.reduce(
    (acc, item) => acc + (item.priceAdded || 0),
    basePrice
  );

  return (
    <div className={cn("w-full bg-[var(--color-bg-primary)] rounded-[8px] shadow-elegant overflow-hidden flex flex-col border border-[var(--color-border-subtle)]", className)}>
      {/* Header */}
      <div className="bg-[var(--color-bg-secondary)] p-6 border-b border-[var(--color-border-subtle)]">
        <h3 className="text-h3 font-serif text-[var(--color-text-primary)] leading-tight">
          {productName}
        </h3>
        <p className="text-body-m text-[var(--color-text-secondary)] mt-1">
          Customization Summary
        </p>
      </div>

      {/* Line Items */}
      <div className="p-6 flex-1 flex flex-col space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-dashed border-[var(--color-border-subtle)]">
          <span className="text-body-m font-medium text-[var(--color-text-primary)]">Base Price</span>
          <span className="text-body-m text-[var(--color-text-secondary)]">{currencySymbol}{Number(basePrice || 0).toFixed(2)}</span>
        </div>

        <div className="flex flex-col space-y-3 min-h-[120px]">
          <AnimatePresence>
            {selections.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex justify-between items-center text-[14px]"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {item.name}
                  </span>
                  <span className="text-[var(--color-text-secondary)] italic">
                    {item.value}
                  </span>
                </div>
                {item.priceAdded && item.priceAdded > 0 ? (
                  <span className="text-[var(--color-text-primary)]">
                    +{currencySymbol}{Number(item.priceAdded || 0).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-[var(--color-text-tertiary)] text-[12px] uppercase tracking-wider">
                    Included
                  </span>
                )}
              </motion.div>
            ))}
            
            {selections.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-body-m text-[var(--color-text-tertiary)] italic pt-2"
              >
                Awaiting your selections...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer / Total */}
      <div className="p-6 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-subtle)]">
        <div className="flex justify-between items-end mb-6">
          <span className="text-h4 font-serif text-[var(--color-text-primary)]">Total</span>
          <motion.span
            key={totalPrice}
            initial={{ scale: 1.1, color: "var(--color-accent-emerald)" }}
            animate={{ scale: 1, color: "var(--color-text-primary)" }}
            className="text-h3 font-serif font-medium"
          >
            {currencySymbol}{Number(totalPrice || 0).toFixed(2)}
          </motion.span>
        </div>
        
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full"
          onClick={onContinue}
          isLoading={isContinuing}
        >
          Review & Add to Cart
        </Button>
        <p className="text-center text-micro text-[var(--color-text-tertiary)] mt-3">
          Complimentary shipping over {currencySymbol}150
        </p>
      </div>
    </div>
  );
};
