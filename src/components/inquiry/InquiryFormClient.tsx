"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import {
  InquiryType,
  InquiryFormData,
  INQUIRY_TYPE_LABELS,
  VISIBLE_FIELDS,
  BUDGET_RANGES,
  TIMELINES,
  HOW_DID_YOU_HEAR,
} from "@/types/inquiry";
import { stepVariants, transitions } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ─── Simple floating-label input ─────────────────────────────────────────────

function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  required,
  error,
  id,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  id: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {label} {required && <span className="text-[#1A4338]">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-12 px-4 border bg-white text-sm text-slate-800 placeholder:text-slate-300 outline-none transition-all",
          error
            ? "border-red-400 focus:border-red-500 ring-1 ring-red-200"
            : "border-slate-200 focus:border-[#1A4338] focus:ring-1 focus:ring-[#1A4338]/20"
        )}
      />
      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}

function FloatingTextarea({
  label, value, onChange, required, error, id,
}: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; error?: string; id: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {label} {required && <span className="text-[#1A4338]">*</span>}
      </label>
      <textarea
        id={id}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-4 py-3 border bg-white text-sm text-slate-800 placeholder:text-slate-300 outline-none transition-all resize-none",
          error ? "border-red-400" : "border-slate-200 focus:border-[#1A4338] focus:ring-1 focus:ring-[#1A4338]/20"
        )}
      />
      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}

function SelectInput({
  label, value, onChange, options, required, error, id,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean; error?: string; id: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {label} {required && <span className="text-[#1A4338]">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-12 px-4 border bg-white text-sm text-slate-700 outline-none appearance-none cursor-pointer transition-all",
          error ? "border-red-400" : "border-slate-200 focus:border-[#1A4338]"
        )}
      >
        <option value="">Select…</option>
        {options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
      </select>
      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

type Errors = Partial<Record<keyof InquiryFormData, string>>;

function validateStep(step: number, data: InquiryFormData): Errors {
  const errs: Errors = {};
  if (step === 0) {
    if (!data.firstName.trim()) errs.firstName = "Please enter your first name.";
    if (!data.lastName.trim()) errs.lastName = "Please enter your last name.";
    if (!data.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(data.email))
      errs.email = "Please enter a valid email address.";
    if (data.phone && !/^\+?[\d\s\-()]{7,15}$/.test(data.phone))
      errs.phone = "Please enter a valid phone number.";
  }
  if (step === 1) {
    const visible = VISIBLE_FIELDS[data.type];
    if (visible.includes("estimatedGuestCount") && (!data.estimatedGuestCount || data.estimatedGuestCount < 10))
      errs.estimatedGuestCount = "Guest count must be at least 10.";
    if (visible.includes("projectDescription") && !data.projectDescription?.trim())
      errs.projectDescription = "Please describe your project.";
  }
  return errs;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TOTAL_STEPS = 3;

const emptyForm = (): InquiryFormData => ({
  type: "wholesale", firstName: "", lastName: "", email: "",
  company: "", phone: "", eventType: "", eventDate: "",
  projectDescription: "", budgetRange: "", timeline: "", howDidYouHear: "",
  additionalNotes: "", estimatedGuestCount: undefined,
});

export default function InquiryFormClient() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<InquiryFormData>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const set = (key: keyof InquiryFormData) => (val: string) =>
    setData((prev) => ({ ...prev, [key]: val }));

  const visible = VISIBLE_FIELDS[data.type];

  const goNext = () => {
    const errs = validateStep(step, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.referenceId) {
        setReferenceId(json.referenceId);
      }
    } catch {
      setErrors({ email: "Something went wrong. Please try again or email us directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Confirmation ──
  if (referenceId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.normal}
        className="flex flex-col items-center justify-center py-20 space-y-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-[#1A4338] flex items-center justify-center"
        >
          <Check className="w-10 h-10 text-white stroke-[2.5]" />
        </motion.div>
        <div className="space-y-3 max-w-md">
          <h2 className="font-serif text-3xl text-slate-800">We&rsquo;ve received your enquiry!</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Reference ID: <strong className="text-[#1A4338]">{referenceId}</strong>
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            We&rsquo;ll be in touch within 24 hours. In the meantime, feel free to browse our collection.
          </p>
        </div>
        <a href="/shop" className="px-8 py-4 bg-[#1A4338] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A4338]/90 transition-all">
          Browse Collection
        </a>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* Inquiry type tabs */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(INQUIRY_TYPE_LABELS) as InquiryType[]).map((type) => (
          <button
            key={type}
            onClick={() => setData((prev) => ({ ...emptyForm(), type }))}
            className={cn(
              "px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border",
              data.type === type
                ? "bg-[#1A4338] text-white border-[#1A4338]"
                : "bg-white text-slate-500 border-slate-200 hover:border-[#1A4338] hover:text-[#1A4338]"
            )}
          >
            {INQUIRY_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Step progress dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className={cn(
            "h-[3px] flex-grow rounded-full transition-all duration-500",
            i < step ? "bg-[#1A4338]" : i === step ? "bg-[#1A4338]/50" : "bg-slate-100"
          )} />
        ))}
      </div>

      {/* Step fields */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepVariants}
          initial="enter"
          animate="active"
          exit="exit"
          className="space-y-6"
        >
          {/* Step 0 — Contact Info */}
          {step === 0 && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Step 1 of {TOTAL_STEPS} — Contact Info</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FloatingInput id="firstName" label="First Name" value={data.firstName} onChange={set("firstName")} required error={errors.firstName} />
                <FloatingInput id="lastName" label="Last Name" value={data.lastName} onChange={set("lastName")} required error={errors.lastName} />
              </div>
              <FloatingInput id="email" label="Email Address" type="email" value={data.email} onChange={set("email")} required error={errors.email} />
              {visible.includes("company") && (
                <FloatingInput id="company" label="Company / Studio Name" value={data.company ?? ""} onChange={set("company")} />
              )}
              <FloatingInput id="phone" label="Phone Number (optional)" type="tel" value={data.phone ?? ""} onChange={set("phone")} error={errors.phone} />
            </>
          )}

          {/* Step 1 — Event / Project Details */}
          {step === 1 && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Step 2 of {TOTAL_STEPS} — Event Details</p>
              {visible.includes("eventType") && (
                <FloatingInput id="eventType" label="Event Type" value={data.eventType ?? ""} onChange={set("eventType")} />
              )}
              {visible.includes("estimatedGuestCount") && (
                <FloatingInput id="guestCount" label="Estimated Guest Count" type="number" value={String(data.estimatedGuestCount ?? "")} onChange={(v) => setData((p) => ({ ...p, estimatedGuestCount: Number(v) }))} required error={errors.estimatedGuestCount as string} />
              )}
              {visible.includes("eventDate") && (
                <FloatingInput id="eventDate" label="Event Date" type="date" value={data.eventDate ?? ""} onChange={set("eventDate")} />
              )}
              {visible.includes("projectDescription") && (
                <FloatingTextarea id="projectDesc" label="Tell Us About Your Project" value={data.projectDescription ?? ""} onChange={set("projectDescription")} required error={errors.projectDescription} />
              )}
            </>
          )}

          {/* Step 2 — Budget & Timeline */}
          {step === 2 && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Step 3 of {TOTAL_STEPS} — Budget & Timeline</p>
              {visible.includes("budgetRange") && (
                <SelectInput id="budget" label="Approximate Budget" value={data.budgetRange ?? ""} onChange={set("budgetRange")} options={BUDGET_RANGES} />
              )}
              {visible.includes("timeline") && (
                <SelectInput id="timeline" label="Timeline" value={data.timeline ?? ""} onChange={set("timeline")} options={TIMELINES} />
              )}
              <SelectInput id="howHear" label="How Did You Hear About Us?" value={data.howDidYouHear ?? ""} onChange={set("howDidYouHear")} options={HOW_DID_YOU_HEAR} />
              <FloatingTextarea id="notes" label="Additional Notes" value={data.additionalNotes ?? ""} onChange={set("additionalNotes")} />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors disabled:opacity-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {step < TOTAL_STEPS - 1 ? (
          <button
            onClick={goNext}
            className="flex items-center gap-2 px-8 py-4 bg-[#1A4338] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A4338]/90 transition-all shadow-lg hover:-translate-y-0.5"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-4 bg-[#1A4338] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A4338]/90 transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isSubmitting ? "Sending…" : "Send Enquiry"}
          </button>
        )}
      </div>
    </div>
  );
}
