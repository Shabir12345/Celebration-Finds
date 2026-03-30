"use client";

import { Search, PenTool, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Browse & Discover",
    description: "Explore our curated collection of favours, from premium candles to handcrafted keepsakes.",
    icon: Search,
  },
  {
    title: "Personalize & Build",
    description: "Our dynamic gift builder lets you customize text, colors, scents, and more for each item.",
    icon: PenTool,
  },
  {
    title: "Celebrate & Share",
    description: "Your custom gifts arrive beautifully packaged, ready to delight your guests and celebrate.",
    icon: Sparkles,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-muted overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connector Lines (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-slate-200 z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center text-center space-y-6 z-10"
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-primary transform transition-transform duration-500 hover:rotate-12">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-accent">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm md:text-base text-slate-500 max-w-[280px] leading-relaxed tracking-wide font-medium">
                    {step.description}
                  </p>
                </div>
                {/* Mobile Connectors */}
                {idx < steps.length - 1 && (
                  <div className="md:hidden w-px h-12 bg-slate-200 my-4" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
