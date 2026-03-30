"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { shakeVariants } from "@/lib/motion";

interface PhotoUploadFieldProps {
  label: string;
  fieldKey: string;
  required?: boolean;
  error?: string;
  description?: string;
  maxSizeMb?: number;
  onUploadComplete?: (fieldKey: string, url: string) => void;
  onError?: (message: string) => void;
}

export default function PhotoUploadField({
  label,
  fieldKey,
  required = false,
  error,
  description,
  maxSizeMb = 5,
  onUploadComplete,
  onError,
}: PhotoUploadFieldProps) {
  const {
    upload,
    isDragging,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    clearUpload,
    inputRef,
  } = usePhotoUpload({ fieldKey, maxSizeMb, onUploadComplete, onError });

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {label} {required && <span className="text-primary">*</span>}
        </label>
        {description && (
          <p className="text-[11px] text-slate-400 font-medium">{description}</p>
        )}
      </div>

      {/* Drop zone */}
      <motion.div
        animate={error ? "shake" : ""}
        variants={shakeVariants}
      >
        {!upload ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed cursor-pointer transition-all duration-300",
              isDragging
                ? "border-[#1A4338] bg-[rgba(26,67,56,0.05)]"
                : "border-slate-200 bg-[#F5F2EB] hover:border-slate-400 hover:bg-white"
            )}
          >
            <motion.div
              animate={{ scale: isDragging ? 1.15 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {isDragging ? (
                <ImageIcon className="w-10 h-10 text-[#1A4338]" />
              ) : (
                <Upload className="w-10 h-10 text-slate-300" />
              )}
            </motion.div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-slate-600">
                {isDragging ? "Drop your photo here" : "Drag & drop your photo"}
              </p>
              <p className="text-[11px] text-slate-400">
                or <span className="text-[#1A4338] font-bold">browse files</span> · JPG, PNG, WebP · Max {maxSizeMb}MB
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
          </div>
        ) : (
          /* Preview state */
          <div className="relative overflow-hidden bg-slate-100">
            <div className="aspect-[4/3] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={upload.previewUrl}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />

              {/* Upload progress overlay */}
              {upload.uploadStatus === "uploading" && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                  <p className="text-white text-xs font-bold uppercase tracking-widest">
                    Uploading…
                  </p>
                </div>
              )}

              {/* Error overlay */}
              {upload.uploadStatus === "error" && (
                <div className="absolute inset-0 bg-red-900/60 flex flex-col items-center justify-center gap-2">
                  <p className="text-white text-xs font-bold">Upload failed.</p>
                  <button
                    onClick={clearUpload}
                    className="px-4 py-2 bg-white text-red-700 text-[10px] font-bold uppercase tracking-widest"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* Replace button — top right */}
            {upload.uploadStatus === "done" && (
              <button
                onClick={clearUpload}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-2 bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-white transition-colors"
              >
                <X className="w-3 h-3" />
                Replace
              </button>
            )}
          </div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-medium text-red-500 mt-2"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
