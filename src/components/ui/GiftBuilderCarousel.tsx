"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles, Droplet, Type } from "lucide-react";
import { Button } from "./Button";

const PREVIEW_STEPS = [
  { id: "color", label: "Choose Hue", icon: Droplet },
  { id: "scent", label: "Select Scent", icon: Sparkles },
  { id: "message", label: "Card Message", icon: Type },
];

const COLORS = [
  { name: "Ivory", hex: "#FDFBF7" },
  { name: "Blush", hex: "#F2D8D5" },
  { name: "Emerald", hex: "#1A4338" },
  { name: "Navy", hex: "#1C2A3A" },
];

const SCENTS = [
  { name: "Vanilla Bean", tag: "Warm" },
  { name: "Rose Water", tag: "Floral" },
  { name: "Sandalwood", tag: "Woody" },
];

export const GiftBuilderCarousel = () => {
  const [activeStep, setActiveStep] = useState(PREVIEW_STEPS[0].id);
  const [selectedColor, setSelectedColor] = useState(COLORS[1]);
  const [selectedScent, setSelectedScent] = useState(SCENTS[0]);

  return (
    <section className="py-24 px-6 max-w-[1440px] mx-auto overflow-hidden">
      <div className="text-center mb-16">
        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--color-text-tertiary)] mb-4 block">Interactive Preview</span>
        <h2 className="text-h2 font-serif text-[var(--color-text-primary)] mb-4">Design Your Gift in Seconds</h2>
        <p className="text-body-m text-[var(--color-text-secondary)] font-light max-w-xl mx-auto italic">Experience the joy of our intuitive Gift Builder. Customization has never been this elegant.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-center bg-[var(--color-bg-secondary)] rounded-[2rem] p-8 lg:p-16 border border-[var(--color-border-subtle)] shadow-sm">
        
        {/* Left: Interactive Controls */}
        <div className="w-full lg:w-1/2 space-y-10">
          <div className="flex gap-4 border-b border-[var(--color-border-subtle)] overflow-x-auto pb-4 hide-scrollbar">
            {PREVIEW_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-2 px-4 py-2 font-serif text-sm transition-all whitespace-nowrap ${
                  activeStep === step.id 
                  ? "text-[var(--color-accent-navy)] border-b-2 border-[var(--color-accent-gold)]" 
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                <step.icon className={`w-4 h-4 ${activeStep === step.id ? "text-[var(--color-accent-gold)]" : "opacity-50"}`} />
                {step.label}
              </button>
            ))}
          </div>

          <div className="h-[200px] relative">
            <AnimatePresence mode="wait">
              {activeStep === "color" && (
                <motion.div
                  key="color"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 hidden-scrollbar"
                >
                  <p className="text-body-s uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold">Select Ribbon Hue</p>
                  <div className="flex flex-wrap gap-4">
                    {COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        className={`group flex items-center gap-3 p-3 rounded-xl border luxury-transition w-[140px] ${
                          selectedColor.name === c.name 
                            ? "border-[var(--color-accent-gold)] bg-white shadow-md shadow-[var(--color-accent-gold)]/10" 
                            : "border-transparent hover:border-[var(--color-border-subtle)] hover:bg-white/50"
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-full shadow-inner border border-black/5"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className={`text-sm ${selectedColor.name === c.name ? "font-medium text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"}`}>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeStep === "scent" && (
                <motion.div
                  key="scent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <p className="text-body-s uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold">Curate the Fragrance</p>
                  <div className="flex flex-col gap-3">
                    {SCENTS.map((s) => (
                      <button
                        key={s.name}
                        onClick={() => setSelectedScent(s)}
                        className={`flex items-center justify-between p-4 rounded-xl border luxury-transition left-align max-w-sm ${
                          selectedScent.name === s.name
                            ? "border-[var(--color-accent-emerald)] bg-white"
                            : "border-[var(--color-border-subtle)] hover:border-[var(--color-accent-emerald)]/50 bg-transparent"
                        }`}
                      >
                        <span className="font-serif text-[var(--color-text-primary)]">{s.name}</span>
                        <span className="text-xs tracking-widest text-[var(--color-text-tertiary)] uppercase">{s.tag}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeStep === "message" && (
                <motion.div
                  key="message"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 max-w-sm"
                >
                  <p className="text-body-s uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold">Write a Perfect Note</p>
                  <textarea 
                    placeholder="Enter a heartfelt message..."
                    className="w-full h-32 p-4 bg-white border border-[var(--color-border-subtle)] rounded-xl font-serif text-[var(--color-text-primary)] shadow-inner text-sm focus:outline-none focus:border-[var(--color-accent-gold)] luxury-transition resize-none"
                    value="To my dearest friends, thank you for sharing this magical day..."
                    readOnly
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Button 
            className="group mt-8 bg-[var(--color-text-primary)] text-white hover:bg-[var(--color-accent-navy)]"
            onClick={() => window.location.href = '/demo-builder'}
          >
            Launch Full Builder
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 luxury-transition" />
          </Button>
        </div>

        {/* Right: Live Visual Preview */}
        <div className="w-full lg:w-1/2 flex justify-center pb-8 lg:pb-0 relative">
          <motion.div 
            className="relative w-full aspect-square max-w-[450px] bg-white rounded-full shadow-[0_24px_64px_rgba(28,42,58,0.06)] flex items-center justify-center p-12 overflow-hidden border border-[var(--color-border-subtle)]/30"
            layoutId="previewBox"
          >
            {/* The base gift image */}
            <div className="relative z-10 w-full h-full flex items-center justify-center drop-shadow-2xl">
               <Image 
                 src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1080&auto=format&fit=crop" 
                 alt="Gift Box"
                 fill
                 className="object-cover rounded shadow-lg mix-blend-multiply transition-opacity duration-500"
                 sizes="(max-width: 1080px) 100vw, 450px"
               />
            </div>
            
            {/* Overlay glow simulating the ribbon color mapping */}
            <AnimatePresence mode="popLayout">
              <motion.div 
                key={selectedColor.hex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 0.8, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-[15%] rounded-full blur-3xl z-0"
                style={{ backgroundColor: selectedColor.hex }}
              />
            </AnimatePresence>

            {/* Scent label badge applied on the "box" */}
             <AnimatePresence mode="popLayout">
                <motion.div
                  key={selectedScent.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-16 right-16 z-20 bg-white/90 backdrop-blur-md px-4 py-2 border border-[#D4AF37]/30 shadow-lg rounded-sm"
                >
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#1A4338] opacity-80 mb-0.5">Scent Note</p>
                  <p className="font-serif text-sm text-slate-800 italic">{selectedScent.name}</p>
                </motion.div>
             </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
