"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  floatingLabel?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, floatingLabel = true, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

    // For floating labels, we omit the border initially to fit the minimal "boutique" aesthetic
    // until focus or populated.
    return (
      <div className="relative w-full flex flex-col group space-y-1">
        {!floatingLabel && (
          <label htmlFor={inputId} className="text-[14px] font-medium text-[var(--color-text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "peer w-full h-12 bg-transparent text-[var(--color-text-primary)] font-sans text-[16px] outline-none placeholder-transparent luxury-transition",
              floatingLabel 
                ? "border-b border-[var(--color-border-subtle)] focus:border-b-2 focus:border-[var(--color-accent-gold)] rounded-none px-0 mb-[1px] focus:mb-0" 
                : "border border-[var(--color-border-subtle)] focus:border-2 focus:border-[var(--color-accent-gold)] rounded-[4px] px-4",
              error && "border-[var(--color-status-error)] focus:border-[var(--color-status-error)] text-[var(--color-status-error)]",
              className
            )}
            placeholder={label} // Needed for CSS peer-placeholder-shown logic
            {...props}
          />
          {floatingLabel && (
            <label
              htmlFor={inputId}
              className={cn(
                "absolute left-0 cursor-text luxury-transition font-sans pointer-events-none",
                isFocused 
                  ? "-top-3 text-[12px] font-medium text-[var(--color-accent-gold)]"
                  : props.value && props.value !== ""
                  ? "-top-3 text-[12px] text-[var(--color-text-secondary)]" 
                  : "top-3 text-[16px] text-[var(--color-text-tertiary)] peer-placeholder-shown:top-3 peer-placeholder-shown:text-[16px]",
                error && "text-[var(--color-status-error)]"
              )}
            >
              {label}
            </label>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[12px] text-[var(--color-status-error)] font-sans font-medium"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";
