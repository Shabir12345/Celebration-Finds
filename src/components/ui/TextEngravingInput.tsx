"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface TextEngravingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fontType?: "serif" | "script"; // Toggles preview typography
  maxLength?: number;
}

export const TextEngravingInput = React.forwardRef<HTMLInputElement, TextEngravingInputProps>(
  ({ className, label = "Enter your engraving", error, fontType = "serif", maxLength = 24, id, value, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `engraving-input`;
    // We maintain internal length tracking to display the counter properly
    const textLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full flex flex-col space-y-4">
        {/* The Live Rendering Preview Area */}
        <div className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-md h-[160px] flex items-center justify-center p-8 relative overflow-hidden shadow-sm">
          {/* Faint watermark or card simulation */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('/noise.png')", backgroundBlendMode: "overlay" }} />
          
          <AnimatePresence mode="popLayout">
            {value ? (
              <motion.p
                key="engraved-text"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "text-center w-full break-words gold-foil-text text-[32px] md:text-[40px] leading-tight luxury-transition",
                  fontType === "script" ? "font-serif italic" : "font-serif tracking-wide uppercase"
                )}
                style={{ 
                  textShadow: "0px 1px 2px rgba(0,0,0,0.1), inset 0px -1px 1px rgba(255,255,255,0.4)" 
                }}
              >
                {value}
              </motion.p>
            ) : (
              <motion.p
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "text-[var(--color-text-tertiary)] text-[24px] luxury-transition",
                  fontType === "script" ? "font-serif italic" : "font-serif tracking-widest uppercase"
                )}
              >
                YOUR TEXT HERE
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* The Input Form Area */}
        <div className="relative group">
          <input
            id={inputId}
            ref={ref}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "peer w-full h-14 bg-transparent text-[var(--color-text-primary)] font-sans text-[16px] outline-none placeholder-transparent luxury-transition px-0 border-b-2 rounded-none",
              isFocused 
                ? "border-[var(--color-accent-gold)] shadow-[0_1px_0_0_var(--color-accent-gold)]" 
                : "border-[var(--color-border-subtle)] hover:border-[var(--color-text-secondary)]",
              error && "border-[var(--color-status-error)] hover:border-[var(--color-status-error)] text-[var(--color-status-error)] shadow-[0_1px_0_0_var(--color-status-error)]",
              className
            )}
            placeholder={label} // peer-placeholder needs this
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-0 cursor-text luxury-transition font-sans pointer-events-none",
              isFocused || (value && value !== "")
                ? "-top-4 text-[12px] font-medium text-[var(--color-accent-gold)] uppercase tracking-wider" 
                : "top-4 text-[16px] text-[var(--color-text-tertiary)] peer-placeholder-shown:top-4 peer-placeholder-shown:text-[16px]",
              error && "text-[var(--color-status-error)]"
            )}
          >
            {label}
          </label>
          
          <div className="w-full flex justify-between mt-2 px-1">
             <AnimatePresence>
                {error ? (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[12px] text-[var(--color-status-error)] font-sans font-medium"
                  >
                    {error}
                  </motion.p>
                ) : (
                  <span /> // Spacer
                )}
              </AnimatePresence>
            <span className={cn(
              "text-[12px] font-medium luxury-transition",
              textLength >= maxLength 
                ? "text-[var(--color-status-error)]" 
                : "text-[var(--color-text-tertiary)]"
            )}>
              {textLength} / {maxLength}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

TextEngravingInput.displayName = "TextEngravingInput";
