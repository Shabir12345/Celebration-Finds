"use client";

import { useState, useCallback, useRef } from "react";
import { UploadedFile } from "@/types/customization";

const MAX_SIZE_MB_DEFAULT = 5;
const ALLOWED_TYPES_DEFAULT = ["image/jpeg", "image/png", "image/webp"];

interface UsePhotoUploadOptions {
  fieldKey: string;
  maxSizeMb?: number;
  allowedTypes?: string[];
  onUploadComplete?: (fieldKey: string, url: string) => void;
  onError?: (message: string) => void;
}

interface UsePhotoUploadReturn {
  upload: UploadedFile | null;
  isDragging: boolean;
  handleFileSelect: (file: File) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  clearUpload: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function usePhotoUpload({
  fieldKey,
  maxSizeMb = MAX_SIZE_MB_DEFAULT,
  allowedTypes = ALLOWED_TYPES_DEFAULT,
  onUploadComplete,
  onError,
}: UsePhotoUploadOptions): UsePhotoUploadReturn {
  const [upload, setUpload] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `Please upload a JPG, PNG, or WebP image.`;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `Photo must be under ${maxSizeMb}MB.`;
    }
    return null;
  };

  const processFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        onError?.(validationError);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      const pendingUpload: UploadedFile = {
        file,
        previewUrl,
        uploadStatus: "uploading",
      };
      setUpload(pendingUpload);

      try {
        // NOTE: Replace this with your actual upload endpoint
        // e.g. POST /api/upload → returns { url: string }
        // For now, simulate a short delay and use the preview URL
        await new Promise((res) => setTimeout(res, 1200));

        const doneUpload: UploadedFile = {
          ...pendingUpload,
          uploadStatus: "done",
          uploadedUrl: previewUrl, // ← replace with real URL from API
        };
        setUpload(doneUpload);
        onUploadComplete?.(fieldKey, previewUrl);
      } catch {
        setUpload((prev) =>
          prev ? { ...prev, uploadStatus: "error" } : null
        );
        onError?.("Upload failed. Please try again.");
      }
    },
    [fieldKey, maxSizeMb, allowedTypes, onUploadComplete, onError]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      processFile(file);
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const clearUpload = useCallback(() => {
    if (upload?.previewUrl) {
      URL.revokeObjectURL(upload.previewUrl);
    }
    setUpload(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [upload]);

  return {
    upload,
    isDragging,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    clearUpload,
    inputRef,
  };
}
