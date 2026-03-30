"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Lock body scroll when modal is open
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm luxury-transition"
          />

          {/* Modal Content Drawer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] flex flex-col items-center justify-center p-4 sm:p-0 pointer-events-none"
          >
            <div className="w-full bg-[var(--color-bg-primary)] shadow-modal rounded-[8px] overflow-hidden p-8 pointer-events-auto relative">
              <button
                onClick={onClose}
                className="absolute right-6 top-6 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] luxury-transition rounded-full focus-visible:ring-2 focus-visible:ring-[var(--color-accent-emerald)] outline-none"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>

              {title && (
                <h3 className="text-h3 font-serif text-[var(--color-text-primary)] mb-6 text-center">
                  {title}
                </h3>
              )}
              
              <div className="w-full">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
