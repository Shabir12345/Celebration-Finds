"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import { X, ShoppingBag } from "lucide-react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  options?: Record<string, string>; // e.g. { Color: "Blush", Engraving: "J & M" }
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  currencySymbol?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckout,
  currencySymbol = "$",
}) => {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-[#1A1A1A]/40 backdrop-blur-sm"
          />

          {/* Sliding Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-[var(--color-bg-primary)] shadow-modal flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-subtle)]">
              <h2 className="text-h3 font-serif text-[var(--color-text-primary)]">Your Bag</h2>
              <button
                onClick={onClose}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] luxury-transition p-2"
                aria-label="Close Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-8 relative">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-[var(--color-text-tertiary)] opacity-60">
                  <ShoppingBag className="w-12 h-12" />
                  <p className="font-serif text-h4">Your bag is empty.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0 }}
                      className="flex space-x-4 pb-8 border-b border-[var(--color-border-subtle)] last:border-b-0 last:pb-0"
                    >
                      <div className="w-24 h-32 flex-shrink-0 bg-[var(--color-bg-tertiary)] rounded-sm overflow-hidden">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h4 className="text-[16px] font-serif font-medium text-[var(--color-text-primary)]">{item.name}</h4>
                          <span className="font-sans font-medium text-[var(--color-text-primary)]">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        
                        <div className="mt-2 flex flex-col space-y-1">
                          {item.options && Object.entries(item.options).map(([key, val]) => (
                            <span key={key} className="text-micro text-[var(--color-text-secondary)]">
                              <span className="opacity-70">{key}:</span> {val}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-4">
                          <span className="text-[14px] text-[var(--color-text-tertiary)]">Qty: {item.quantity}</span>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[12px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-status-error)] uppercase tracking-wider luxury-transition underline-offset-4 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-subtle)] shrink-0">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[16px] text-[var(--color-text-secondary)]">Subtotal</span>
                  <span className="text-h3 font-serif">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                <Button variant="primary" size="lg" className="w-full bg-[var(--color-accent-emerald)] text-white hover:brightness-110" onClick={onCheckout}>
                  Secure Checkout
                </Button>
                <p className="text-center text-[12px] text-[var(--color-text-tertiary)] mt-4">
                  Taxes and complimentary shipping calculated at checkout.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
