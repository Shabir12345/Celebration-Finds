"use client";

import React from "react";
import { GiftBuilderWizard, WizardStep } from "@/components/ui/GiftBuilderWizard";

const mockSteps: WizardStep[] = [
  {
    id: "step-1",
    title: "1. Select Aroma",
    fields: [
      {
        id: "scent",
        title: "Signature Scent",
        description: "Choose a bespoke fragrance mapping to the mood of your event.",
        required: true,
        config: {
          type: "scent",
          options: [
            { id: "s1", name: "Lavender Woods", family: "woodsy", description: "Deep, earthy grounding." },
            { id: "s2", name: "Blush Peony", family: "floral", description: "Soft, romantic petals." },
            { id: "s3", name: "Sea Salt & Sage", family: "fresh", description: "Crisp, airy mornings." },
            { id: "s4", name: "Warm Amber", family: "warm", description: "Rich, inviting firelight." },
          ]
        }
      }
    ]
  },
  {
    id: "step-2",
    title: "2. Visual Identity",
    fields: [
      {
        id: "color",
        title: "Ribbon Hue",
        description: "Select the finishing ribbon color to bind your gift.",
        required: true,
        config: {
          type: "color",
          options: [
            { id: "c1", name: "Ivory Silk", hexCode: "#FDFBF7" },
            { id: "c2", name: "Dusty Blush", hexCode: "#F2D8D5" },
            { id: "c3", name: "Emerald Velvet", hexCode: "#1A4338" },
            { id: "c4", name: "Midnight Navy", hexCode: "#1C2A3A" },
            { id: "c5", name: "Gold Satin", hexCode: "#D4AF37", outOfStock: true },
          ]
        }
      },
      {
        id: "photo",
        title: "Packaging Monogram / Photo",
        description: "Optionally upload a high-resolution crest, monogram, or couple's photo for the box interior.",
        config: { type: "photo", maxSizeMB: 10 }
      }
    ]
  },
  {
    id: "step-3",
    title: "3. Personalization",
    fields: [
      {
        id: "engraving",
        title: "Foil Engraving",
        description: "Engrave the outer glass purely in gold foil. A classic finish.",
        config: {
          type: "engraving",
          fontType: "serif",
          maxLength: 18
        }
      }
    ]
  }
];

export default function DemoBuilderPage() {
  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen pt-24">
      <div className="text-center mb-8 px-6">
        <h1 className="text-h2 font-serif text-[var(--color-text-primary)]">
          Interactive Builder Demo
        </h1>
        <p className="text-body-m text-[var(--color-text-secondary)] mt-2">
          Experience the full journey assembly with the new design system.
        </p>
      </div>

      <GiftBuilderWizard
        basePrice={45.00}
        productName="Bespoke Celebration Candle"
        steps={mockSteps}
        onComplete={(data) => {
          alert(`Added to Cart with Customizations:\n${JSON.stringify(data, null, 2)}`);
        }}
      />
    </div>
  );
}
