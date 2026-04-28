"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { CustomizationField, CustomizationFieldRenderer } from "./CustomizationFieldRenderer";
import { LiveOrderSummary, LineItem } from "./LiveOrderSummary";

export interface WizardStep {
  id: string;
  title: string;
  fields: CustomizationField[];
}

export interface GiftBuilderWizardProps {
  basePrice: number;
  productName: string;
  steps: WizardStep[];
  onComplete: (selections: Record<string, any>) => void;
}

export const GiftBuilderWizard: React.FC<GiftBuilderWizardProps> = ({
  basePrice,
  productName,
  steps,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Transform selections object into LiveOrderSummary line items array
  const formattedLineItems: LineItem[] = Object.keys(selections)
    .filter((key) => selections[key] !== null && selections[key] !== "")
    .map((key) => {
      // Find the corresponding field to get title and price info
      for (const step of steps) {
        const field = step.fields.find((f) => f.id === key);
        if (field) {
          // If we had pricing tied to specific colors/scents, we would extract it here. 
          // For now, mocking a standard +0.00 unless custom logic specifies.
          const isEngraving = field.config.type === "engraving";
          return {
            id: key,
            name: field.title,
            value: typeof selections[key] === "string" && (selections[key].startsWith("blob:") || selections[key].startsWith("http")) ? "Image Uploaded" : String(selections[key]),
            priceAdded: isEngraving && selections[key] ? 15.00 : 0 // Mocking $15 for engraving for demo
          };
        }
      }
      return { id: key, name: key, value: String(selections[key]) };
    });

  const handleNext = () => {
    if (!isLastStep) setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isFirstStep) setCurrentStepIndex((prev) => prev - 1);
  };

  const handleComplete = () => {
    setIsFinishing(true);
    // Simulate network delay for UX
    setTimeout(() => {
      onComplete(selections);
      setIsFinishing(false);
    }, 1500);
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setSelections((prev) => ({ ...prev, [fieldId]: value }));
  };

  // Variants for smooth cross-fade + directional sliding based on step progression
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  // Keep track of sliding direction
  const [[page, direction], setPage] = useState([0, 0]);
  
  // Custom setter to track direction
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
    if (newDirection > 0) handleNext();
    else handlePrev();
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row relative lg:h-[calc(100vh-100px)] lg:overflow-hidden bg-[var(--color-bg-primary)]">
      
      {/* Scrollable Main Column (Form Area) */}
      <div className="w-full lg:w-2/3 h-full overflow-y-auto overflow-x-hidden flex flex-col p-6 lg:p-12 relative pb-40 lg:pb-12 custom-scrollbar">
        
        {/* Desktop Breadcrumbs Timeline */}
        <div className="hidden lg:flex items-center space-x-2 mb-10 text-micro font-medium uppercase tracking-widest text-[var(--color-text-tertiary)] w-full">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <button 
                onClick={() => {
                   const dir = idx > currentStepIndex ? 1 : -1;
                   if (idx !== currentStepIndex) {
                      setPage([idx, dir]);
                      setCurrentStepIndex(idx);
                   }
                }}
                className={cn(
                  "luxury-transition hover:text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-emerald)] rounded-sm",
                  currentStepIndex === idx ? "text-[var(--color-text-primary)]" : "",
                  currentStepIndex > idx ? "text-[var(--color-text-secondary)]" : ""
                )}
              >
                {step.title}
              </button>
              {idx < steps.length - 1 && <ChevronRight className="w-4 h-4 opacity-50" />}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Minimalist Step Header (collapses gracefully) */}
        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-border-subtle)]">
           <div className="flex flex-col space-y-1">
             <span className="text-micro font-sans font-medium text-[var(--color-text-secondary)] uppercase tracking-widest">
               Step {currentStepIndex + 1} of {steps.length}
             </span>
             <h2 className="text-h3 font-serif text-[var(--color-text-primary)] leading-tight">
               {currentStep.title}
             </h2>
           </div>
           
           <div className="flex items-center space-x-2">
             <Button variant="ghost" size="sm" className="px-2" onClick={() => paginate(-1)} disabled={isFirstStep}>
               <ChevronLeft className="w-4 h-4" />
             </Button>
             <Button variant="ghost" size="sm" className="px-2" onClick={() => paginate(1)} disabled={isLastStep}>
               <ChevronRight className="w-4 h-4" />
             </Button>
           </div>
        </div>

        {/* Desktop Step Title */}
        <h2 className="hidden lg:block text-h2 font-serif text-[var(--color-text-primary)] mb-8">
          {currentStep.title}
        </h2>

        {/* Form Fields wrapped in Framer Motion AnimatePresence */}
        <div className="flex-1 w-full max-w-[800px] relative min-h-[400px]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
             <motion.div
               key={currentStepIndex}
               custom={direction}
               variants={slideVariants}
               initial="enter"
               animate="center"
               exit="exit"
               transition={{
                 x: { type: "spring", stiffness: 300, damping: 30 },
                 opacity: { duration: 0.3 }
               }}
               className="w-full flex flex-col space-y-2"
             >
               {currentStep.fields.map((field) => (
                 <CustomizationFieldRenderer
                   key={field.id}
                   field={field}
                   value={selections[field.id]}
                   onChange={(val) => handleFieldChange(field.id, val)}
                 />
               ))}
               
               {/* Spacer for bottom padding */}
               <div className="h-10 w-full" />
             </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop Prev/Next Controls (Bottom of page) */}
        <div className="hidden lg:flex w-full justify-between items-center mt-auto pt-8 border-t border-[var(--color-border-subtle)] max-w-[800px]">
          {isFirstStep ? <div /> : (
             <Button variant="text" size="lg" className="pl-0" onClick={() => paginate(-1)}>
               <ChevronLeft className="w-5 h-5 mr-2" /> Back
             </Button>
          )}

          {!isLastStep ? (
            <Button variant="primary" size="lg" onClick={() => paginate(1)}>
               Next Step <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={handleComplete} isLoading={isFinishing}>
               Complete Customization
            </Button>
          )}
        </div>
      </div>

      {/* Right Column / Sticky Bottom Mobile: Live Order Summary */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:static lg:w-1/3 lg:h-full lg:p-12 lg:bg-[var(--color-bg-secondary)] border-t lg:border-t-0 lg:border-l border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] shadow-[0_-4px_24px_rgba(0,0,0,0.05)] lg:shadow-none p-4 pb-safe lg:pb-12">
        <div className="h-full w-full max-w-[500px] mx-auto lg:sticky lg:top-12 lg:h-[calc(100vh-200px)] flex flex-col justify-end lg:justify-start">
           
           {/* Desktop relies on the component natively */}
           <div className="hidden lg:block h-full">
             <LiveOrderSummary
               productName={productName}
               basePrice={basePrice}
               selections={formattedLineItems}
               onContinue={handleComplete}
               isContinuing={isFinishing}
               className="h-full border-none shadow-none bg-transparent"
             />
           </div>

           {/* Mobile Minimal Pricing Bar (Overrides the LiveSummary for tight layout) */}
           <div className="lg:hidden flex items-center justify-between w-full h-14">
             <div className="flex flex-col">
               <span className="text-micro text-[var(--color-text-secondary)] uppercase tracking-wider">Total</span>
               <AnimatePresence mode="popLayout">
                 <motion.span 
                   key={formattedLineItems.reduce((acc, i) => acc + (i.priceAdded || 0), basePrice)}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-h4 font-serif text-[var(--color-text-primary)]"
                 >
                    ${(formattedLineItems.reduce((acc, i) => acc + (i.priceAdded || 0), Number(basePrice || 0))).toFixed(2)}
                 </motion.span>
               </AnimatePresence>
             </div>
             
             {!isLastStep ? (
               <Button variant="primary" size="lg" onClick={() => paginate(1)}>
                 Next Step
               </Button>
             ) : (
               <Button variant="primary" size="lg" onClick={handleComplete} isLoading={isFinishing}>
                 Add to Cart
               </Button>
             )}
           </div>

        </div>
      </div>

    </div>
  );
};
