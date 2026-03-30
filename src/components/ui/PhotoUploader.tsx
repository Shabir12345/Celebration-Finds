"use client";

import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";

export interface PhotoUploaderProps {
  onUpload: (file: File) => void;
  onRemove: () => void;
  previewUrl: string | null;
  maxSizeMB?: number;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onUpload,
  onRemove,
  previewUrl,
  maxSizeMB = 5,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateAndUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPEG, PNG, WEBP).");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be less than ${maxSizeMB}MB.`);
      return;
    }
    setError(null);
    onUpload(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndUpload(e.dataTransfer.files[0]);
      }
    },
    [maxSizeMB, onUpload]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {previewUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full aspect-square md:aspect-video rounded-md overflow-hidden bg-[var(--color-bg-tertiary)] group"
          >
            {/* Using next/image would be ideal, but for purely client UI previews, standard img blob parsing works. */}
            <img 
              src={previewUrl} 
              alt="Customization Preview" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Overlay Gradient for readability of Action */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-text-primary)]/40 to-transparent opacity-0 group-hover:opacity-100 luxury-transition" />
            
            <button
              onClick={onRemove}
              aria-label="Remove Photo"
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md text-[var(--color-text-primary)] rounded-full shadow-sm hover:scale-110 active:scale-95 luxury-transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-emerald)]"
            >
              <X className="w-4 h-4" />
            </button>

            <label
              htmlFor="photo-replace-upload"
              className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md text-[var(--color-text-primary)] font-sans text-ui font-medium rounded-sm shadow-sm hover:bg-white cursor-pointer hover:scale-105 active:scale-95 luxury-transition focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--color-accent-emerald)]"
            >
              Replace Image
              <input
                id="photo-replace-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileInput}
              />
            </label>
          </motion.div>
        ) : (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative w-full flex flex-col items-center justify-center border-2 border-dashed rounded-md p-10 cursor-pointer luxury-transition min-h-[240px]",
              isDragging
                ? "border-[var(--color-accent-emerald)] bg-[var(--color-accent-emerald)]/5"
                : "border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-text-secondary)]",
              error && "border-[var(--color-status-error)] bg-[var(--color-status-error)]/5"
            )}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-emerald)] focus-visible:ring-offset-2 -m-2 p-2 block"
              onChange={handleFileInput}
              aria-label="Upload Photo"
            />
            
            <div className="flex flex-col items-center pointer-events-none text-center">
              <div 
                className={cn(
                  "p-4 rounded-full mb-4 luxury-transition",
                  isDragging ? "bg-[var(--color-accent-emerald)]/10 text-[var(--color-accent-emerald)] scale-110" : "bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]",
                  error && "text-[var(--color-status-error)] bg-[var(--color-status-error)]/10"
                )}
              >
                {isDragging ? <UploadCloud className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
              </div>
              <h4 className="text-h4 font-serif text-[var(--color-text-primary)] mb-1">
                Upload your photo
              </h4>
              <p className="text-body-m font-sans text-[var(--color-text-secondary)] max-w-[280px]">
                {isDragging ? "Drop the image here to customize" : "Drag and drop, or click to browse files."}
              </p>
              
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[12px] text-[var(--color-status-error)] mt-4 font-medium"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
