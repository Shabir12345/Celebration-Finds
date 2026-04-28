"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export interface HeroSectionProps {
  type?: "split" | "full-bleed" | "editorial";
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  imageUrl: string;
  hasOverlay?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  type = "split",
  headline,
  subheadline,
  ctaText = "Shop the Collection",
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  imageUrl,
  hasOverlay = true,
}) => {
  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacityOffset = useTransform(scrollY, [0, 500], [1, 0]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  if (type === "split") {
    return (
      <section className="relative w-full min-h-[90vh] flex flex-col md:flex-row overflow-hidden bg-[var(--color-bg-primary)]">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-0 w-full md:w-1/2 h-full bg-gradient-to-br from-[var(--color-brand-blush)]/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Left Content */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 z-10 relative">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col max-w-xl"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent-gold)]/30 bg-[var(--color-accent-gold)]/5 backdrop-blur-md">
                <span className="gold-foil-text text-sm font-semibold tracking-widest uppercase">
                  ✧ The Art of Gifting ✧
                </span>
              </span>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h1 className="text-display font-serif text-[var(--color-text-primary)] leading-[1.1] mb-6 tracking-tight">
                {headline}
              </h1>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <p className="text-body-l text-[var(--color-text-secondary)] mb-10 max-w-md leading-relaxed font-light">
                {subheadline}
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="primary" 
                onClick={() => ctaHref && (window.location.href = ctaHref)}
                className="group relative overflow-hidden bg-[var(--color-accent-navy)] text-white hover:bg-[var(--color-accent-navy)]/90 luxury-transition shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {ctaText}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Button>
              {secondaryCtaText && (
                <Button 
                  size="lg" 
                  variant="ghost" 
                  onClick={() => secondaryCtaHref && (window.location.href = secondaryCtaHref)}
                  className="group relative border border-[var(--color-border-subtle)] hover:border-[var(--color-text-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] luxury-transition"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {secondaryCtaText}
                  </span>
                </Button>
              )}
            </motion.div>
            
            {/* Trust Badges */}
            <motion.div variants={itemVariants} className="mt-14 flex items-center gap-6 text-[var(--color-text-tertiary)] text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-accent-gold)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span>5-Star Rated</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[var(--color-border-subtle)]" />
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-bg-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Bespoke Quality</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Right Image Parallax Box */}
        <div className="w-full md:w-1/2 h-[60vh] md:h-auto relative overflow-hidden bg-[var(--color-bg-tertiary)]">
          {mounted && (
            <motion.div style={{ y: yOffset }} className="absolute inset-[-10%] w-[120%] h-[120%]">
              <Image
                src={imageUrl}
                alt={headline}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          )}
          {hasOverlay && <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-text-primary)]/40 via-transparent to-transparent mix-blend-multiply" />}
          
          {/* Glassmorphism Floating Detail Card */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className="absolute bottom-8 lg:bottom-16 left-8 lg:left-[-2rem] z-20 p-5 rounded-xl bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-w-[240px]"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-blush)] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[var(--color-accent-navy)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>
              </div>
              <div>
                <h4 className="font-serif text-[var(--color-text-primary)] font-semibold text-sm">Perfectly Tailored</h4>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">Hand-selected materials for your celebration.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Fallback to Full Bleed
  return (
    <section className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden bg-[var(--color-bg-primary)]">
      {mounted && (
        <motion.div style={{ y: yOffset }} className="absolute inset-0 w-full h-[120%]">
          <Image 
            src={imageUrl} 
            alt={headline} 
            fill 
            priority
            className="object-cover object-center" 
            sizes="100vw"
          />
        </motion.div>
      )}
      
      {/* Luxurious Warm Overlay */}
      {hasOverlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-brand-blush)]/20 via-[var(--color-text-primary)]/60 to-[var(--color-text-primary)]/90 backdrop-blur-[2px]" />
      )}

      <motion.div 
        style={{ opacity: opacityOffset }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center p-8 max-w-4xl"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-5 py-2 border border-white/30 rounded-full bg-white/10 backdrop-blur-md">
            <span className="text-white text-xs font-semibold tracking-[0.3em] uppercase">
              ✧ The Art of Gifting ✧
            </span>
          </span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-display font-serif text-white leading-[1.05] mb-6 drop-shadow-2xl">
          {headline}
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-body-l text-white/90 mb-10 max-w-2xl drop-shadow-md font-light text-lg">
          {subheadline}
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
          <Button 
            size="lg" 
            className="group relative bg-white text-[var(--color-accent-navy)] hover:bg-white/95 luxury-transition shadow-2xl hover:-translate-y-1 px-10 min-w-[240px]" 
            onClick={() => ctaHref && (window.location.href = ctaHref)}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {ctaText}
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Button>
          {secondaryCtaText && (
            <Button 
              size="lg" 
              variant="ghost" 
              className="group relative border border-white/60 text-white hover:bg-white/10 hover:border-white luxury-transition px-10 min-w-[240px]" 
              onClick={() => secondaryCtaHref && (window.location.href = secondaryCtaHref)}
            >
              <span className="relative z-10 flex items-center justify-center">
                {secondaryCtaText}
              </span>
            </Button>
          )}
        </motion.div>

        {/* Center-aligned Trust Badges for Full Bleed */}
        <motion.div variants={itemVariants} className="mt-16 flex items-center gap-8 text-white/70 text-sm font-medium">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--color-accent-gold)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span>5-Star Service</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span>Customized Just for You</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

