"use client";

import { useForm } from "react-hook-form";
import { Send, FileUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { submitInquiry, InquiryData } from "@/lib/actions/inquiries";

export default function InquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InquiryData>();

  const onSubmit = async (data: InquiryData) => {
    setIsSubmitting(true);
    try {
      const result = await submitInquiry(data);
      if (result.success) {
        setIsSuccess(true);
        reset();
      } else {
        alert("Submission failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 shadow-2xl border border-slate-50 relative overflow-hidden group">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
      
      {isSuccess ? (
        <div className="py-20 text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Send className="w-8 h-8" />
            </div>
            <div className="space-y-2">
                <h3 className="font-serif text-3xl font-bold text-accent">Enquiry Received</h3>
                <p className="text-slate-500 font-sans max-w-sm mx-auto">
                    Thank you for reaching out. A dedicated member of our team will contact you within 24 hours.
                </p>
            </div>
            <button 
                onClick={() => setIsSuccess(false)}
                className="text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors underline underline-offset-8"
            >
                Send Another Enquiry
            </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2 mb-8">
                <h3 className="font-serif text-3xl font-bold text-accent tracking-tight">Start Your Consultation</h3>
                <p className="text-slate-500 text-sm font-medium tracking-wide">Tell us about your event and gifting vision.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name *</label>
                    <input 
                        {...register("name", { required: true })}
                        className={cn(
                            "w-full bg-slate-50 border-b-2 border-slate-100 p-4 focus:border-primary focus:bg-white outline-none transition-all font-sans",
                            errors.name && "border-red-500"
                        )}
                        placeholder="e.g. Elizabeth Bennet"
                    />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address *</label>
                    <input 
                        {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                        className={cn(
                            "w-full bg-slate-50 border-b-2 border-slate-100 p-4 focus:border-primary focus:bg-white outline-none transition-all font-sans",
                            errors.email && "border-red-500"
                        )}
                        placeholder="e.g. elizabeth@pemberley.com"
                    />
                </div>

                {/* Company (Optional) */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Company / Organization</label>
                    <input 
                        {...register("company")}
                        className="w-full bg-slate-50 border-b-2 border-slate-100 p-4 focus:border-primary focus:bg-white outline-none transition-all font-sans"
                        placeholder="e.g. Longbourn Events"
                    />
                </div>

                {/* Event Type */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Event Type *</label>
                    <select 
                        {...register("eventType", { required: true })}
                        className={cn(
                            "w-full bg-slate-50 border-b-2 border-slate-100 p-4 focus:border-primary focus:bg-white outline-none transition-all font-sans appearance-none",
                            errors.eventType && "border-red-500"
                        )}
                    >
                        <option value="">Select an occasion...</option>
                        <option value="wedding">Wedding</option>
                        <option value="baby_shower">Baby Shower</option>
                        <option value="birthday">Birthday</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="other">Other Celebration</option>
                    </select>
                </div>

                {/* Event Date (Optional) */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Event Date</label>
                    <input 
                        type="date"
                        {...register("eventDate")}
                        className="w-full bg-slate-50 border-b-2 border-slate-100 p-4 focus:border-primary focus:bg-white outline-none transition-all font-sans"
                    />
                </div>

                {/* Guest Count (Mapped to quantity for now) */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Estimated Guest Count</label>
                    <select 
                        {...register("quantity")}
                        className="w-full bg-slate-50 border-b-2 border-slate-100 p-4 focus:border-primary focus:bg-white outline-none transition-all font-sans appearance-none"
                    >
                        <option value="">Choose a range...</option>
                        <option value="50">25 - 50</option>
                        <option value="100">50 - 100</option>
                        <option value="200">100 - 200</option>
                        <option value="500">200+</option>
                    </select>
                </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tell us more about your vision *</label>
                <textarea 
                    {...register("message", { required: true })}
                    rows={4}
                    className={cn(
                        "w-full bg-slate-50 border-b-2 border-slate-100 p-4 focus:border-primary focus:bg-white outline-none transition-all font-sans",
                        errors.message && "border-red-500"
                    )}
                    placeholder="Briefly describe what products your're looking for and any custom elements..."
                />
            </div>

            {/* File Upload Placeholder */}
            <div className="p-8 border-2 border-dashed border-slate-100 rounded-lg flex flex-col items-center justify-center space-y-4 text-center group/upload hover:border-primary/30 transition-colors cursor-pointer bg-slate-50/50">
                <FileUp className="w-8 h-8 text-slate-300 group-hover/upload:text-primary transition-colors" />
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Attach Mood Board or Brief</p>
                    <p className="text-[9px] text-slate-400 font-medium">PDF, JPG, PNG (Max 10MB)</p>
                </div>
            </div>

            {/* Submit */}
            <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-accent text-white font-bold uppercase tracking-widest text-xs hover:bg-accent/90 transition-all flex items-center justify-center space-x-3 shadow-xl disabled:opacity-50"
            >
                {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <span>Submit Consultation Request</span>
                        <Send className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>
      )}
    </div>
  );
}
