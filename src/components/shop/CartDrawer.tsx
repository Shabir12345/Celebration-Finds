"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Undo2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart, CartItem } from "@/hooks/useCart";
import { useUndoRemove } from "@/hooks/useUndoRemove";
import { transitions } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 150;
const STALE_PRICE_MS = 24 * 60 * 60 * 1000; // 24 hours

// ─── Free shipping progress bar ──────────────────────────────────────────────

function FreeShippingBar({ total }: { total: number }) {
  const pct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

  return (
    <div className="px-6 py-4 bg-[#F5F2EB] border-b border-slate-100 space-y-2">
      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#1A4338] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={transitions.normal}
        />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">
        {pct >= 100 ? (
          <span className="text-[#1A4338]">🎉 You&apos;ve unlocked free shipping!</span>
        ) : (
          <>Add <strong className="text-slate-700">${Number(remaining || 0).toFixed(2)}</strong> more for free shipping</>
        )}
      </p>
    </div>
  );
}

// ─── Cart Item Row ────────────────────────────────────────────────────────────

function CartItemRow({
  item,
  onSoftRemove,
  onUpdateQty,
  isStale,
}: {
  item: CartItem;
  onSoftRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  isStale: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={transitions.normal}
      className="flex gap-4 py-5 border-b border-slate-50 last:border-0"
    >
      {/* Thumbnail */}
      <div className="relative w-16 h-20 shrink-0 bg-slate-100 overflow-hidden">
        <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="64px" />
      </div>

      {/* Details */}
      <div className="flex-grow space-y-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-serif text-sm font-medium text-slate-800 leading-snug line-clamp-2">
            {item.productName}
          </p>
          <button
            onClick={() => onSoftRemove(item.id)}
            className="shrink-0 text-slate-300 hover:text-red-400 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Stale price warning */}
        {isStale && (
          <div className="flex items-center gap-1 text-amber-600">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Price may have changed
            </span>
          </div>
        )}

        {/* Customization snippet */}
        {item.customizations && Object.keys(item.customizations).length > 0 && (
          <p className="text-[10px] text-slate-400 truncate">
            {Object.values(item.customizations).filter(Boolean).slice(0, 2).join(" · ")}
          </p>
        )}

        <div className="flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQty(item.id, item.quantity - 25)}
              disabled={item.quantity <= 25}
              className="w-7 h-7 flex items-center justify-center border border-slate-200 text-slate-600 hover:border-[#1A4338] transition-colors disabled:opacity-30 text-sm font-bold"
            >
              −
            </button>
            <span className="text-sm font-bold text-slate-800 w-10 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.id, item.quantity + 25)}
              className="w-7 h-7 flex items-center justify-center border border-slate-200 text-slate-600 hover:border-[#1A4338] transition-colors text-sm font-bold"
            >
              +
            </button>
          </div>

          <span className="font-serif text-base font-medium text-slate-800">
            ${Number((item.price || 0) * (item.quantity || 0)).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main CartDrawer ──────────────────────────────────────────────────────────

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    getTotalPrice,
    addItem,
  } = useCart();

  const totalPrice = getTotalPrice();
  const now = Date.now();

  const { remove, undo, pendingIds } = useUndoRemove<CartItem>(
    (id) => removeItem(id),
    (item) => addItem({
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      customizations: item.customizations,
    })
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.normal}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white shadow-2xl flex flex-col"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#1A4338]" />
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-800">
                  Your Bag
                  {items.length > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-[#1A4338] text-white text-[9px] rounded-full">
                      {items.length}
                    </span>
                  )}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free shipping bar */}
            {items.length > 0 && <FreeShippingBar total={totalPrice} />}

            {/* Undo toast — shown for any pending removals */}
            <AnimatePresence>
              {pendingIds.map((id) => {
                const item = items.find((i) => i.id === id);
                return (
                  <motion.div
                    key={`undo-${id}`}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mx-4 mt-3 px-4 py-3 bg-slate-800 text-white text-xs flex items-center justify-between rounded-sm shadow-lg"
                  >
                    <span className="font-medium">
                      {item?.productName ?? "Item"} removed.
                    </span>
                    <button
                      onClick={() => undo(id)}
                      className="flex items-center gap-1.5 text-[#D4AF37] font-bold uppercase tracking-widest text-[10px] hover:underline"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      Undo
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Items list */}
            <div className="flex-grow overflow-y-auto px-6">
              {items.filter(i => !pendingIds.includes(i.id)).length === 0 && !pendingIds.length ? (
                <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
                  <ShoppingBag className="w-12 h-12 text-slate-200" />
                  <div className="space-y-2">
                    <p className="font-serif text-xl text-slate-600">Your bag is empty.</p>
                    <p className="text-xs text-slate-400">Explore our collections to find the perfect custom gift.</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 border border-[#1A4338] text-[#1A4338] text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A4338] hover:text-white transition-all"
                  >
                    Browse Shop
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items
                    .filter((i) => !pendingIds.includes(i.id))
                    .map((item) => (
                      <CartItemRow
                        key={item.id}
                        item={item}
                        onSoftRemove={(id) => remove(id, item)}
                        onUpdateQty={updateQuantity}
                        isStale={now - item.addedAt > STALE_PRICE_MS}
                      />
                    ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.filter((i) => !pendingIds.includes(i.id)).length > 0 && (
              <div className="px-6 py-6 border-t border-slate-100 space-y-4">
                {/* Order total */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Subtotal
                  </span>
                  <span className="font-serif text-2xl font-medium text-slate-800">
                    ${Number(totalPrice || 0).toFixed(2)}
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                  Taxes and shipping calculated at checkout
                </p>

                <button
                  className="w-full py-5 bg-[#1A4338] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A4338]/90 transition-all shadow-xl hover:-translate-y-0.5"
                  onClick={() => {
                    setIsOpen(false);
                    // TODO: navigate to /checkout or open Stripe checkout
                  }}
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
