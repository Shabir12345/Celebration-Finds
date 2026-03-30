"use client";

import { useReducer, useCallback } from "react";
import {
  WizardState,
  WizardAction,
  WizardStatus,
  WizardFieldValue,
  UploadedFile,
  SchemaField,
  CustomizationSchema,
} from "@/types/customization";

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: WizardState = {
  status: "stepActive",
  currentStep: 0,
  values: {},
  errors: {},
  touched: {},
  uploadedFiles: {},
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        values: { ...state.values, [action.key]: action.val },
        // Clear error on change
        errors: { ...state.errors, [action.key]: "" },
      };

    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.key]: action.message },
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.key]: "" },
      };

    case "SET_TOUCHED":
      return {
        ...state,
        touched: { ...state.touched, [action.key]: true },
      };

    case "GO_TO_STEP":
      return {
        ...state,
        currentStep: action.step,
        status: action.step === -1 ? "summaryReview" : "stepActive",
      };

    case "SET_STATUS":
      return { ...state, status: action.status };

    case "SET_UPLOAD":
      return {
        ...state,
        uploadedFiles: { ...state.uploadedFiles, [action.key]: action.file },
      };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateField(
  field: SchemaField,
  value: WizardFieldValue,
  uploadedFiles: Record<string, UploadedFile>
): string | null {
  const isEmpty =
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "");

  if (field.is_required && isEmpty && field.field_type !== "photo_upload") {
    switch (field.field_type) {
      case "color_swatch": return "Please choose a colour.";
      case "scent_selector": return "Please pick a scent.";
      case "ribbon_selector": return "Please choose a ribbon style.";
      case "dropdown": return `Please select a ${field.label.toLowerCase()}.`;
      default: return "Please fill in this field.";
    }
  }

  if (field.field_type === "photo_upload" && field.is_required) {
    const upload = uploadedFiles[field.field_key];
    if (!upload || upload.uploadStatus === "error") {
      return "Please add a photo.";
    }
  }

  if (field.field_type === "text" && typeof value === "string") {
    const { min_length, max_length, pattern, pattern_message } = field.validation || {};
    if (min_length && value.trim().length < min_length) {
      return `Please enter at least ${min_length} characters.`;
    }
    if (max_length && value.length > max_length) {
      return `Please keep it to ${max_length} characters.`;
    }
    if (pattern && value && !new RegExp(pattern).test(value)) {
      return pattern_message || "Please check the format of this field.";
    }
  }

  return null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWizardReducer(schema: CustomizationSchema) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const activeFields = schema.fields
    .filter((field) => {
      if (!field.dependent_on) return true;
      return state.values[field.dependent_on.field_key] === field.dependent_on.value;
    })
    .sort((a, b) => a.display_order - b.display_order);

  const currentField = activeFields[state.currentStep] ?? null;
  const totalSteps = activeFields.length;
  const isLastStep = state.currentStep === totalSteps - 1;

  /** Update a field value */
  const setFieldValue = useCallback((key: string, val: WizardFieldValue) => {
    dispatch({ type: "SET_VALUE", key, val });
  }, []);

  /** Mark a field as touched (for onBlur validation display) */
  const touchField = useCallback((key: string) => {
    dispatch({ type: "SET_TOUCHED", key });
  }, []);

  /** Set an upload file record */
  const setUpload = useCallback((key: string, file: UploadedFile) => {
    dispatch({ type: "SET_UPLOAD", key, file });
  }, []);

  /** Validate the current step. Returns true if valid. */
  const validateCurrentStep = useCallback((): boolean => {
    if (!currentField) return true;

    dispatch({ type: "SET_TOUCHED", key: currentField.field_key });

    const error = validateField(currentField, state.values[currentField.field_key] ?? null, state.uploadedFiles);
    if (error) {
      dispatch({ type: "SET_ERROR", key: currentField.field_key, message: error });
      return false;
    }
    return true;
  }, [currentField, state.values, state.uploadedFiles]);

  /** Navigate to a specific step (or -1 for summary) */
  const goToStep = useCallback((step: number) => {
    dispatch({ type: "GO_TO_STEP", step });
  }, []);

  /** Go to next step; validates first */
  const goNext = useCallback((): boolean => {
    if (!validateCurrentStep()) return false;
    if (isLastStep) {
      dispatch({ type: "GO_TO_STEP", step: -1 }); // → summaryReview
    } else {
      dispatch({ type: "GO_TO_STEP", step: state.currentStep + 1 });
    }
    return true;
  }, [validateCurrentStep, isLastStep, state.currentStep]);

  /** Go to previous step */
  const goBack = useCallback(() => {
    if (state.status === "summaryReview") {
      dispatch({ type: "GO_TO_STEP", step: totalSteps - 1 });
    } else if (state.currentStep > 0) {
      dispatch({ type: "GO_TO_STEP", step: state.currentStep - 1 });
    }
  }, [state.status, state.currentStep, totalSteps]);

  const setStatus = useCallback((status: WizardStatus) => {
    dispatch({ type: "SET_STATUS", status });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    activeFields,
    currentField,
    totalSteps,
    isLastStep,
    isSummaryReview: state.status === "summaryReview",
    isSubmitting: state.status === "submitting",
    isSuccess: state.status === "success",
    setFieldValue,
    touchField,
    setUpload,
    validateCurrentStep,
    goToStep,
    goNext,
    goBack,
    setStatus,
    reset,
  };
}
