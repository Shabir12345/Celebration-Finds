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
  const FREE_SHIPPING_THRESHOLD = 250;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountAway = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

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
            {/* Header & Promos */}
            <div className="flex flex-col border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center justify-between p-6 pb-4">
                <h2 className="text-h3 font-serif text-[var(--color-text-primary)]">Your Bag</h2>
                <button
                  onClick={onClose}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] luxury-transition p-2"
                  aria-label="Close Cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Bar */}
              {items.length > 0 && (
                <div className="px-6 pb-5">
                  <div className="flex items-center justify-between mb-2 text-xs font-medium tracking-wide">
                    {amountAway > 0 ? (
                      <span className="text-[var(--color-text-secondary)]">
                        You're <span className="font-bold text-[var(--color-accent-emerald)]">{currencySymbol}{Number(amountAway || 0).toFixed(2)}</span> away from complimentary shipping.
                      </span>
                    ) : (
                      <span className="font-bold text-[var(--color-accent-emerald)] flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Complimentary shipping unlocked!
                      </span>
                    )}
                  </div>
                  <div className="h-1 w-full bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[var(--color-accent-emerald)] luxury-transition"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
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
                          <span className="font-sans font-medium text-[var(--color-text-primary)]">{currencySymbol}{Number((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
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

              {/* Cart Upsells (Only show if cart has items) */}
              {items.length > 0 && (
                <div className="mt-8 pt-8 border-t border-[var(--color-border-subtle)] border-dashed">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-4">Pairs Perfectly With</h4>
                  <div className="bg-[var(--color-bg-secondary)] p-4 rounded-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-sm border border-[var(--color-border-subtle)] overflow-hidden">
                        <img src="https://plus.unsplash.com/premium_photo-1673884221507-3cf36d88f92a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8YmxhY2slMjBmbGFza3xlbnwwfHx8fDE3NzQ0NTMyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Satin Ribbon Upgrade" className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
                      </div>
                      <div>
                        <p className="text-sm font-serif font-medium text-[var(--color-text-primary)]">Premium Satin Ribbon</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">+$15.00</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-navy)] hover:text-[var(--color-accent-emerald)] bg-transparent border-none p-2 luxury-transition outline-none">
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-subtle)] shrink-0">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[16px] text-[var(--color-text-secondary)]">Subtotal</span>
                  <span className="text-h3 font-serif">{currencySymbol}{Number(subtotal || 0).toFixed(2)}</span>
                </div>
                <Button variant="primary" size="lg" className="w-full bg-[var(--color-accent-emerald)] text-white hover:brightness-110 shadow-lg hover:shadow-xl mb-4" onClick={onCheckout}>
                  Secure Checkout
                </Button>
                
                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 mt-4 opacity-70">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-secondary)]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Secure
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[var(--color-border-subtle)]" />
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-secondary)]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Guarantee
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
