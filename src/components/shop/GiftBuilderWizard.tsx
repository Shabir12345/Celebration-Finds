"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, ShoppingBag, Edit3 } from "lucide-react";
import { CustomizationSchema, SchemaField } from "@/types/customization";
import { useWizardReducer } from "@/hooks/useWizardReducer";
import { usePricing } from "@/hooks/usePricing";
import { useCart } from "@/hooks/useCart";
import { stepVariants, transitions } from "@/lib/motion";
import { cn } from "@/lib/utils";
import TextEngravingInput from "./fields/TextEngravingInput";
import ColorSwatchPicker from "./fields/ColorSwatchPicker";
import ScentSelector from "./fields/ScentSelector";
import PhotoUploadField from "./fields/PhotoUploadField";
import DropdownSelector from "./fields/DropdownSelector";
import RibbonSelector from "./fields/RibbonSelector";
import LiveOrderSummary from "./LiveOrderSummary";

interface GiftBuilderWizardProps {
  schema: CustomizationSchema;
  productName: string;
  basePrice: number;
  productImage?: string;
}

// ─── Field Renderer ───────────────────────────────────────────────────────────

function FieldRenderer({
  field,
  value,
  error,
  onChange,
  onBlur,
  onUploadComplete,
  onUploadError,
}: {
  field: SchemaField;
  value: any;
  error?: string;
  onChange: (val: any) => void;
  onBlur?: () => void;
  onUploadComplete?: (key: string, url: string) => void;
  onUploadError?: (msg: string) => void;
}) {
  const commonProps = {
    label: field.label,
    value: value ?? "",
    onChange,
    onBlur,
    required: field.is_required,
    error,
    description: field.description,
  };

  switch (field.field_type) {
    case "text":
      return (
        <TextEngravingInput
          {...commonProps}
          placeholder={field.placeholder}
          maxLength={field.validation?.max_length}
        />
      );
    case "color_swatch":
      return (
        <ColorSwatchPicker
          {...commonProps}
          options={field.options ?? []}
        />
      );
    case "scent_selector":
      return (
        <ScentSelector
          {...commonProps}
          options={field.options ?? []}
        />
      );
    case "photo_upload":
      return (
        <PhotoUploadField
          label={field.label}
          fieldKey={field.field_key}
          required={field.is_required}
          error={error}
          description={field.description}
          maxSizeMb={field.validation?.max_size_mb}
          onUploadComplete={onUploadComplete}
          onError={onUploadError}
        />
      );
    case "dropdown":
      return (
        <DropdownSelector
          {...commonProps}
          options={field.options ?? []}
          placeholder={field.placeholder}
        />
      );
    case "ribbon_selector":
      return (
        <RibbonSelector
          {...commonProps}
          options={field.options ?? []}
        />
      );
    default:
      return null;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GiftBuilderWizard({
  schema,
  productName,
  basePrice,
  productImage,
}: GiftBuilderWizardProps) {
  const wizard = useWizardReducer(schema);
  const { addItem, setIsOpen } = useCart();

  // Quantity defaults to 25 (minimum order)
  const quantity = 25;
  const pricing = usePricing(
    basePrice,
    wizard.state.values,
    quantity,
    schema.pricing_rules ?? []
  );

    const {
    state,
    activeFields,
    activeSteps,
    currentStepData,
    totalSteps,
    isLastStep,
    isSummaryReview,
    isSubmitting,
    isSuccess,
    setFieldValue,
    touchField,
    setUpload,
    goNext,
    goBack,
    goToStep,
    setStatus,
    reset,
  } = wizard;

  const handleComplete = () => {
    setStatus("submitting");
    addItem({
      productId: schema.product_id,
      productName,
      price: pricing.unitPrice,
      quantity,
      image:
        productImage ??
        "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80",
      customizations: state.values,
    });
    setStatus("success");
    setTimeout(() => {
      setIsOpen(true);
      reset();
    }, 1200);
  };

  // ─── Summary Review Screen ─────────────────────────────────────────────────
  if (isSummaryReview || isSuccess) {
    return (
      <div className="w-full flex flex-col lg:flex-row shadow-2xl bg-white border border-slate-100 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.normal}
          className="flex-grow p-8 md:p-12 space-y-10"
        >
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-[#1A4338] flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-white stroke-[2.5]" />
              </motion.div>
              <div className="space-y-2">
                <h2 className="font-serif text-3xl text-[#1A4338]">Added to your bag!</h2>
                <p className="text-sm text-slate-500">Opening your cart now…</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A4338]">
                  Review & Confirm
                </p>
                <h2 className="font-serif text-3xl font-bold text-slate-800 tracking-tight">
                  Your customisations
                </h2>
              </div>

              <div className="space-y-4">
                {activeFields.map((field, idx) => {
                  const val = state.values[field.field_key];
                  let displayVal: string = val ? String(val) : "—";
                  if ((field.field_type === "color_swatch" || field.field_type === "scent_selector" || field.field_type === "ribbon_selector" || field.field_type === "dropdown") && val) {
                    displayVal = field.options?.find((o) => o.value === val)?.label ?? displayVal;
                  }
                  
                  // Find which step this field belongs to for editing
                  const stepIndex = activeSteps.findIndex(s => s.fields.some(f => f.field_key === field.field_key));

                  return (
                    <div
                      key={field.field_key}
                      className="flex items-start justify-between py-4 border-b border-slate-100 group"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {field.label}
                        </p>
                        <p className="text-sm font-medium text-slate-700 italic">{displayVal}</p>
                      </div>
                      <button
                        onClick={() => goToStep(stepIndex)}
                        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-[#1A4338] transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={goBack}
                  className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="flex items-center space-x-3 px-8 py-4 bg-[#1A4338] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1A4338]/90 transition-all shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag · {quantity} items</span>
                </button>
              </div>
            </>
          )}
        </motion.div>

        {/* Summary sidebar */}
        <div className="w-full lg:w-[380px] bg-[#F5F2EB] shrink-0 border-l border-slate-100">
          <LiveOrderSummary
            productName={productName}
            productImage={productImage}
            fields={activeFields}
            values={state.values}
            pricing={pricing}
          />
        </div>
      </div>
    );
  }

  // ─── Step Active Screen ────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col lg:flex-row shadow-2xl bg-white border border-slate-100 overflow-hidden">
      {/* Wizard steps panel */}
      <div className="flex-grow p-8 md:p-12 bg-white relative flex flex-col">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10">
          {activeSteps.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-[3px] flex-grow rounded-full transition-all duration-500",
                idx < state.currentStep
                  ? "bg-[#1A4338]"
                  : idx === state.currentStep
                  ? "bg-[#1A4338]/60"
                  : "bg-slate-100"
              )}
            />
          ))}
        </div>

        {/* Step header */}
        <div className="space-y-2 mb-10" aria-live="polite" aria-atomic="true">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            Step {state.currentStep + 1} of {totalSteps}
          </p>
          <h2 className="font-serif text-3xl font-bold text-slate-800 tracking-tight">
            {currentStepData?.title ?? "Customise your gift"}
          </h2>
          {currentStepData?.description && (
            <p className="text-sm text-slate-500 leading-relaxed max-w-prose">
              {currentStepData.description}
            </p>
          )}
        </div>

        {/* Dynamic field — animated transition */}
        <div className="flex-grow min-h-[300px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentStep}
              variants={stepVariants}
              initial="enter"
              animate="active"
              exit="exit"
              className="space-y-8"
            >
              {currentStepData?.fields.map((field) => (
                <div key={field.field_key} className="space-y-2">
                  <FieldRenderer
                    field={field}
                    value={state.values[field.field_key] ?? ""}
                    error={state.touched[field.field_key] ? state.errors[field.field_key] : undefined}
                    onChange={(val) => setFieldValue(field.field_key, val)}
                    onBlur={() => touchField(field.field_key)}
                    onUploadComplete={(key, url) => {
                      setUpload(key, {
                        file: new File([], "photo"),
                        previewUrl: url,
                        uploadStatus: "done",
                        uploadedUrl: url,
                      });
                      setFieldValue(key, url);
                    }}
                    onUploadError={() => {}}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>


        {/* Navigation bar */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
          <button
            onClick={goBack}
            disabled={state.currentStep === 0}
            className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Live unit price badge */}
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            ${Number(pricing.unitPrice || 0).toFixed(2)} each
          </span>

          <button
            onClick={goNext}
            className="flex items-center space-x-2 px-8 py-4 bg-[#1A4338] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1A4338]/90 transition-all shadow-xl hover:-translate-y-0.5"
          >
            {isLastStep ? (
              <>
                <span>Review Order</span>
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary sidebar */}
      <div className="hidden lg:block w-[380px] bg-[#F5F2EB] shrink-0 border-l border-slate-100">
        <LiveOrderSummary
          productName={productName}
          productImage={productImage}
          fields={activeFields}
          values={state.values}
          pricing={pricing}
        />
      </div>
    </div>
  );
}
