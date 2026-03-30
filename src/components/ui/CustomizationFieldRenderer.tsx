"use client";

import React from "react";
import { ColorSwatchPicker, Swatch } from "./ColorSwatchPicker";
import { ScentSelector, Scent } from "./ScentSelector";
import { PhotoUploader } from "./PhotoUploader";
import { TextEngravingInput } from "./TextEngravingInput";

// Union type covering all possible custom configuration types
export type CustomizationFieldType =
  | { type: "color"; options: Swatch[] }
  | { type: "scent"; options: Scent[] }
  | { type: "photo"; maxSizeMB?: number }
  | { type: "engraving"; fontType: "serif" | "script"; maxLength?: number };

export interface CustomizationField {
  id: string;
  title: string;
  description?: string;
  required?: boolean;
  config: CustomizationFieldType;
}

export interface CustomizationFieldRendererProps {
  field: CustomizationField;
  value: any; // Ideally strictly typed, but any for this dynamic map
  onChange: (value: any) => void;
  error?: string;
}

export const CustomizationFieldRenderer: React.FC<CustomizationFieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="flex flex-col space-y-4 py-8 border-b border-[var(--color-border-subtle)] last:border-b-0">
      <div className="flex flex-col space-y-1">
        <label className="text-h4 font-serif text-[var(--color-text-primary)]">
          {field.title} {field.required && <span className="text-[var(--color-accent-gold)]">*</span>}
        </label>
        {field.description && (
          <p className="text-body-m text-[var(--color-text-secondary)] max-w-lg">
            {field.description}
          </p>
        )}
      </div>

      <div className="pt-2">
        {field.config.type === "color" && (
          <ColorSwatchPicker
            swatches={field.config.options}
            selectedId={value as string}
            onSelect={onChange}
            size="lg"
          />
        )}

        {field.config.type === "scent" && (
          <ScentSelector
            scents={field.config.options}
            selectedId={value as string}
            onSelect={onChange}
            layout="list"
          />
        )}

        {field.config.type === "photo" && (
          <PhotoUploader
            previewUrl={value as string | null}
            onUpload={(file) => {
              // In a real app, you would upload to Supabase/Sanity/S3 here
              // For UI demonstration, we create a local blob
              const url = URL.createObjectURL(file);
              onChange(url);
            }}
            onRemove={() => onChange(null)}
            maxSizeMB={field.config.maxSizeMB}
          />
        )}

        {field.config.type === "engraving" && (
          <TextEngravingInput
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            fontType={field.config.fontType}
            maxLength={field.config.maxLength}
            error={error}
            label={`Engraving (${field.config.fontType} font)`}
          />
        )}
      </div>

      {error && field.config.type !== "engraving" && (
        <span className="text-[14px] text-[var(--color-status-error)] font-medium mt-2">
          {error}
        </span>
      )}
    </div>
  );
};
