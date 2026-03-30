"use client";

import React, { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { motion, AnimatePresence } from "framer-motion";

export interface InquiryFormProps {
  onSubmit: (data: Record<string, string>) => Promise<void>;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setIsSuccess(true);
      setFormData({ name: "", email: "", eventDate: "", guestCount: "", details: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setIsSuccess(false), 5000); // Reset success after 5s
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 md:p-12 bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] shadow-sm rounded-sm">
      <div className="text-center mb-10">
        <h2 className="text-h2 font-serif text-[var(--color-text-primary)] mb-4">
          Say Hello
        </h2>
        <p className="text-body-m text-[var(--color-text-secondary)]">
          Tell us a little bit about your party. Our design team will send you a special plan just for your big day.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            id="inquiry-name"
            label="Your Name"
            floatingLabel
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            id="inquiry-email"
            label="Your Email"
            type="email"
            floatingLabel
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            id="inquiry-date"
            label="Event Date"
            type="date"
            floatingLabel
            required
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            // A bit of custom styling to make native date picker hide the placeholder text gracefully
            className="[&::-webkit-datetime-edit]:text-transparent focus:[&::-webkit-datetime-edit]:text-[var(--color-text-primary)] [&:not(:placeholder-shown)]:[&::-webkit-datetime-edit]:text-[var(--color-text-primary)]"
          />
          <Input
            id="inquiry-guests"
            label="How many guests?"
            type="number"
            floatingLabel
            value={formData.guestCount}
            onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
          />
        </div>

        <div className="w-full relative group space-y-1">
          <textarea
            id="inquiry-details"
            required
            placeholder="What is your dream for this party?"
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            className="peer w-full min-h-[120px] bg-transparent text-[var(--color-text-primary)] font-sans text-[16px] outline-none placeholder-transparent luxury-transition border-b border-[var(--color-border-subtle)] focus:border-b-2 focus:border-[var(--color-accent-gold)] rounded-none px-0 resize-y pt-4 mb-[1px] focus:mb-0"
          />
          <label
            htmlFor="inquiry-details"
            className="absolute left-0 cursor-text luxury-transition font-sans pointer-events-none -top-2 text-[12px] text-[var(--color-text-secondary)] peer-placeholder-shown:top-4 peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-[var(--color-text-tertiary)] peer-focus:-top-2 peer-focus:text-[12px] peer-focus:font-medium peer-focus:text-[var(--color-accent-gold)]"
          >
            What is your dream for this party?
          </label>
        </div>

        <div className="pt-4 flex flex-col items-center">
          <Button
            type="submit"
            size="lg"
            variant="navy"
            className="w-full md:w-2/3"
            isLoading={isSubmitting}
            disabled={isSuccess}
          >
            {isSuccess ? "Note Sent" : "Send My Note"}
          </Button>

          <AnimatePresence>
            {isSuccess && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-body-m text-[var(--color-status-success)] mt-4 font-medium"
              >
                Thank you! We will read your note and talk to you very soon.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
};
