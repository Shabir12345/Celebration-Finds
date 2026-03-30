"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  currencySymbol?: string;
  primaryImage: string;
  hoverImage?: string;
  badge?: string; // e.g., "Best Seller", "New Arrival"
  layout?: "standard" | "wide";
  onAddToCart?: (id: string) => void;
  onClick?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  currencySymbol = "$",
  primaryImage,
  hoverImage,
  badge,
  layout = "standard",
  onAddToCart,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handlePointerEnter = () => setIsHovered(true);
  const handlePointerLeave = () => setIsHovered(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    if (onAddToCart) onAddToCart(id);

    // Provide tactile feedback duration
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  if (layout === "wide") {
    // A horizontal layout for featured lists
    return (
      <div 
        className="group relative flex flex-col md:flex-row w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-text-tertiary)] luxury-transition p-4 md:p-6 gap-6 cursor-pointer overflow-hidden rounded-[4px]"
        onClick={() => onClick && onClick(id)}
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
      >
        <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-square relative overflow-hidden rounded-[2px] bg-[var(--color-bg-tertiary)]">
          <img
            src={primaryImage}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover luxury-transition group-hover:scale-105"
          />
          {hoverImage && (
            <img
              src={hoverImage}
              alt={`${title} Lifestyle`}
              loading="lazy"
              className={cn(
                "absolute inset-0 w-full h-full object-cover luxury-transition",
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            />
          )}
          {badge && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest font-medium text-[var(--color-text-primary)]">
              {badge}
            </span>
          )}
        </div>
        
        <div className="flex flex-col flex-1 justify-center space-y-4">
          <div>
            <h3 className="text-h3 font-serif text-[var(--color-text-primary)] mb-2">{title}</h3>
            <p className="text-body-m font-medium text-[var(--color-text-secondary)]">
              {currencySymbol}{price.toFixed(2)}
            </p>
          </div>
          
          <div className="pt-4">
            <Button
              variant={isAdding ? "navy" : "secondary"}
              onClick={handleAddToCart}
              className="w-full md:w-auto"
              disabled={isAdding}
            >
              {isAdding ? "Added to Cart" : "Customize & Add"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Standard vertical grid layout (aspect 4/5 for tall elegant portraits)
  return (
    <div 
      className="group relative flex flex-col w-full cursor-pointer"
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onClick={() => onClick && onClick(id)}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden mb-4 bg-[var(--color-bg-tertiary)] rounded-[2px]">
        {/* Images */}
        <img
          src={primaryImage}
          alt={title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] group-hover:scale-105"
        />
        {hoverImage && (
          <img
            src={hoverImage}
            alt={`${title} Lifestyle`}
            loading="lazy"
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)]",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          />
        )}
        
        {/* Badge */}
        {badge && (
          <span className={cn(
            "absolute top-4 left-4 backdrop-blur-md px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg",
            badge === "Best Seller" 
              ? "bg-[var(--color-accent-gold)] text-white" 
              : "bg-white/90 text-[var(--color-text-primary)]"
          )}>
            {badge === "Best Seller" && <span className="mr-1">✧</span>}
            {badge}
          </span>
        )}

        {/* Hover ATC overlay */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-black/20 to-transparent luxury-transition transform",
          isHovered || isAdding ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}>
          <Button
            variant="primary"
            className={cn(
              "w-full bg-white text-[var(--color-text-primary)] hover:bg-white/90 shadow-elegant",
              isAdding && "bg-[var(--color-accent-emerald)] text-white hover:bg-[var(--color-accent-emerald)]"
            )}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            <AnimatePresence mode="popLayout">
              {isAdding ? (
                <motion.div
                  key="added"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Added</span>
                </motion.div>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  Quick Add
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col space-y-1">
        <h3 className="text-h4 font-serif text-[var(--color-text-primary)]">{title}</h3>
        <p className="text-body-m font-medium text-[var(--color-text-secondary)]">
          {currencySymbol}{price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
