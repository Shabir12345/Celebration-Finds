"use client";

import React, { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { motion } from "framer-motion";
import { Sparkles, Send, CheckCircle2, MessageSquareHeart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InquiryFormProps {
  onSubmit?: (data: Record<string, string>) => Promise<void>;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventDate: "",
    guestCount: "",
    details: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const response = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to send inquiry");
      }
      setIsSuccess(true);
      setFormData({ name: "", email: "", eventDate: "", guestCount: "", details: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-2xl mx-auto p-12 md:p-20 bg-[var(--color-bg-primary)] border border-[var(--color-accent-gold)]/20 shadow-elegant rounded-sm text-center flex flex-col items-center justify-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="w-20 h-20 bg-[var(--color-brand-blush)] rounded-full flex items-center justify-center text-[var(--color-accent-gold)] mb-4"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        
        <h2 className="text-h2 font-serif text-[var(--color-text-primary)] leading-tight">
          Your Note is in Flight
        </h2>
        
        <p className="text-body-l text-[var(--color-text-secondary)] max-w-md">
          Thank you for reaching out. We treat every celebration like our own and will be in touch within 24 hours.
        </p>

        <Button 
          variant="ghost" 
          onClick={() => setIsSuccess(false)}
          className="mt-8 border-[var(--color-accent-gold)] text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)] hover:text-white"
        >
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="w-full max-w-2xl mx-auto p-8 md:p-12 bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] shadow-elegant rounded-sm relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sparkles size={120} className="text-[var(--color-accent-gold)]" />
      </div>

      <div className="text-center mb-12 relative z-10">
        <motion.div 
          className="flex justify-center mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MessageSquareHeart size={32} className="text-[var(--color-accent-gold)]" />
        </motion.div>
        <h2 className="text-h2 font-serif text-[var(--color-text-primary)] mb-4 tracking-tight">
          Say Hello
        </h2>
        <p className="text-body-m text-[var(--color-text-secondary)] max-w-lg mx-auto leading-relaxed">
          Tell us a little bit about your event. Our design team will craft a bespoke plan to make your vision come to life.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <motion.div variants={itemVariants}>
            <Input
              id="inquiry-name"
              label="Bespoke for..."
              placeholder="Your Name"
              floatingLabel
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Input
              id="inquiry-email"
              label="Email Address"
              type="email"
              floatingLabel
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <motion.div variants={itemVariants}>
            <Input
              id="inquiry-date"
              label="The Big Day"
              type="date"
              floatingLabel
              required
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Input
              id="inquiry-guests"
              label="Expected Guests"
              type="number"
              floatingLabel
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
            />
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="w-full relative group space-y-1">
          <textarea
            id="inquiry-details"
            required
            placeholder="Tell us about your dream for this party..."
            value={formData.details}
            onFocus={() => setFocusedField("details")}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            className="peer w-full min-h-[140px] bg-transparent text-[var(--color-text-primary)] font-sans text-[16px] outline-none placeholder-transparent luxury-transition border-b border-[var(--color-border-subtle)] focus:border-b-2 focus:border-[var(--color-accent-gold)] rounded-none px-0 resize-none pt-6"
          />
          <label
            htmlFor="inquiry-details"
            className={cn(
              "absolute left-0 cursor-text luxury-transition font-sans pointer-events-none",
              focusedField === "details" || formData.details !== ""
                ? "-top-3 text-[12px] font-medium text-[var(--color-accent-gold)]"
                : "top-6 text-[16px] text-[var(--color-text-tertiary)] peer-placeholder-shown:top-6 peer-placeholder-shown:text-[16px]"
            )}
          >
            Tell us about your dream for this party...
          </label>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-6 flex flex-col items-center">
          <Button
            type="submit"
            size="lg"
            variant="navy"
            className="w-full md:w-3/4 group relative overflow-hidden"
            isLoading={isSubmitting}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Send My Invitation
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};
