"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { shakeVariants } from "@/lib/motion";

interface TextEngravingInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  error?: string;
  description?: string;
}

export default function TextEngravingInput({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  maxLength = 40,
  required = false,
  error,
  description,
}: TextEngravingInputProps) {
  const isAtLimit = value.length >= maxLength;

  return (
    <div className="space-y-3">
      {/* Label row */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
            {label}{" "}
            {required && <span className="text-primary">*</span>}
          </label>
          {description && (
            <p className="text-[11px] text-slate-400 font-medium">{description}</p>
          )}
        </div>
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-widest transition-colors",
            isAtLimit ? "text-red-500" : "text-slate-400"
          )}
        >
          {value.length} / {maxLength}
        </span>
      </div>

      {/* Input + shake on error */}
      <motion.div
        className="space-y-3"
        animate={error ? "shake" : ""}
        variants={shakeVariants}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          className={cn(
            "w-full bg-white border px-4 py-4 transition-all outline-none font-sans text-slate-800 placeholder:text-slate-300",
            error
              ? "border-red-400 focus:border-red-500 ring-1 ring-red-200"
              : "border-slate-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
          )}
          style={
            error
              ? {}
              : { boxShadow: value ? "0 0 0 1px rgba(212,175,55,0.25)" : undefined }
          }
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
        />

        {/* Error message */}
        {error && (
          <motion.p
            id={`${label}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-medium text-red-500"
          >
            {error}
          </motion.p>
        )}

        {/* Live preview — only if value exists */}
        {value && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-[#FDFBF7] border border-slate-100 flex flex-col items-center justify-center min-h-[90px]"
          >
            <p className="text-[9px] text-slate-400 uppercase tracking-[0.3em] mb-3 font-bold">
              Engraving Preview
            </p>
            <p
              className="font-serif text-2xl text-slate-700 text-center break-words max-w-full italic"
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #FFF2CD 50%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {value}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
