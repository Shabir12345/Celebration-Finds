"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[var(--color-border-subtle)] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-[var(--color-accent-gold)] transition-colors duration-200"
      >
        <h3 className="text-body-l font-serif text-[var(--color-text-primary)]">{question}</h3>
        <div className="ml-4 shrink-0">
          {isOpen ? (
            <Minus className="w-5 h-5 text-[var(--color-accent-gold)]" />
          ) : (
            <Plus className="w-5 h-5 text-[var(--color-accent-gold)]" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-body-m text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FAQSectionProps {
  title?: string;
  items: { question: string; answer: string }[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ 
  title = "Frequently Asked Questions", 
  items 
}) => {
  return (
    <div className="bg-white rounded-3xl p-8 md:p-16">
      <h2 className="text-h2 font-serif text-[var(--color-text-primary)] mb-12">{title}</h2>
      <div className="flex flex-col">
        {items.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
};
