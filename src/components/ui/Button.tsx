"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = {
  primary: "bg-[var(--color-accent-emerald)] text-white hover:brightness-110 shadow-sm",
  navy: "bg-[var(--color-accent-navy)] text-white hover:brightness-110 shadow-sm",
  secondary: "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:brightness-95",
  ghost: "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-text-primary)]",
  text: "bg-transparent text-[var(--color-text-primary)] underline-offset-4 hover:underline",
};

const buttonSizes = {
  sm: "h-8 px-4 text-[12px]",
  md: "h-12 px-6 text-[14px]",
  lg: "h-14 px-8 text-[16px]",
};

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-[4px] font-sans font-medium luxury-transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-emerald)]",
          buttonVariants[variant],
          buttonSizes[size],
          (disabled || isLoading) && "opacity-40 saturate-50 cursor-not-allowed pointer-events-none",
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
