"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, GripVertical, ChevronDown, Type, Palette, Wind, Camera, List, Sparkles } from "lucide-react";
import { FieldType, CustomizationStep, SchemaField } from "@/types/customization";
import { cn } from "@/lib/utils";

interface CustomizationBuilderProps {
  steps: CustomizationStep[];
  onChange: (steps: CustomizationStep[]) => void;
}

const FIELD_TYPES: { type: FieldType; label: string; icon: any }[] = [
  { type: "text", label: "Text Input", icon: Type },
  { type: "color_swatch", label: "Color Swatch", icon: Palette },
  { type: "scent_selector", label: "Scent Selector", icon: Wind },
  { type: "photo_upload", label: "Photo Upload", icon: Camera },
  { type: "dropdown", label: "Dropdown Menu", icon: List },
];

const getTemplates = () => {
  const ts = Date.now();
  return [
    {
      id: "blank",
      label: "Blank Stage",
      icon: Plus,
      description: "Start from scratch",
      step: {
        title: "New Customization Step",
        description: "",
        fields: [],
      }
    },
    {
      id: "writing",
      label: "Text & Inscriptions",
      icon: Type,
      description: "Custom names or messages",
      step: {
        title: "Personalised Inscriptions",
        description: "Add messages for your cards and the item.",
        fields: [
          {
            field_key: `text_${ts}_1`,
            field_type: "text" as FieldType,
            label: "Top of Card",
            placeholder: "e.g. For our special guest",
            is_required: true,
            display_order: 1,
            validation: { max_length: 30 }
          },
          {
            field_key: `text_${ts}_2`,
            field_type: "text" as FieldType,
            label: "Bottom of Card",
            placeholder: "e.g. Love, Sarah & Mark",
            is_required: true,
            display_order: 2,
            validation: { max_length: 30 }
          }
        ]
      }
    },
    {
      id: "scent",
      label: "Signature Scent",
      icon: Wind,
      description: "Fragrance picker with visual icons",
      step: {
        title: "Signature Scent",
        description: "Select the fragrance that best captures the mood of your event.",
        fields: [
          {
            field_key: `scent_${ts}`,
            field_type: "scent_selector" as FieldType,
            label: "Fragrance",
            placeholder: "Classic Floral or Warm Amber?",
            is_required: true,
            display_order: 1,
            options: [
              { value: "vanilla", label: "Warm Vanilla", icon: "🍦" },
              { value: "peony", label: "Fresh Peony", icon: "🌸" },
              { value: "wood", label: "Cedar Wood", icon: "🌲" },
              { value: "jasmine", label: "Jasmine Bloom", icon: "🌺" },
            ]
          }
        ]
      }
    },
    {
      id: "ribbon",
      label: "Ribbon Colour",
      icon: Palette,
      description: "Velvet or satin ribbon selection",
      step: {
        title: "Ribbon Details",
        description: "Choose a luxurious ribbon to finish your package.",
        fields: [
          {
            field_key: `color_${ts}_ribbon`,
            field_type: "color_swatch" as FieldType,
            label: "Ribbon Colour",
            is_required: true,
            display_order: 1,
            options: [
              { value: "#F5F0EB", label: "Warm Ivory", hexColor: "#F5F0EB", stockAvailable: true },
              { value: "#D4B8C7", label: "Soft Pink", hexColor: "#D4B8C7", stockAvailable: true },
              { value: "#5D3754", label: "Deep Berry", hexColor: "#5D3754", stockAvailable: true },
              { value: "#2D4B3F", label: "Forest Green", hexColor: "#2D4B3F", stockAvailable: true },
            ]
          }
        ]
      }
    },
    {
      id: "theme",
      label: "Theme Colour",
      icon: Palette,
      description: "Overall design color scheme",
      step: {
        title: "Theme Colour",
        description: "Select the primary colour theme for this product.",
        fields: [
          {
            field_key: `color_${ts}_theme`,
            field_type: "color_swatch" as FieldType,
            label: "Theme Colour",
            is_required: true,
            display_order: 1,
            options: [
               { value: "#FFD700", label: "Gold", hexColor: "#FFD700", stockAvailable: true },
               { value: "#C0C0C0", label: "Silver", hexColor: "#C0C0C0", stockAvailable: true },
               { value: "#000000", label: "Classic Black", hexColor: "#000000", stockAvailable: true },
               { value: "#FFFFFF", label: "Pure White", hexColor: "#FFFFFF", stockAvailable: true },
            ]
          }
        ]
      }
    },
    {
      id: "photo",
      label: "Photo Upload",
      icon: Camera,
      description: "Allow user to upload an image",
      step: {
        title: "Upload Your Photo",
        description: "Provide a clear, high-quality image.",
        fields: [
          {
            field_key: `photo_${ts}`,
            field_type: "photo_upload" as FieldType,
            label: "Your Photo / Logo",
            is_required: true,
            display_order: 1,
          }
        ]
      }
    }
  ];
};

export default function CustomizationBuilder({ steps, onChange }: CustomizationBuilderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addStepFromTemplate = (templateStep: CustomizationStep) => {
    onChange([...steps, templateStep]);
    setMenuOpen(false);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    onChange(newSteps);
  };

  const updateStep = (index: number, data: Partial<CustomizationStep>) => {
    const newSteps = steps.map((s, i) => (i === index ? { ...s, ...data } : s));
    onChange(newSteps);
  };

  const addField = (stepIndex: number, type: FieldType = "text") => {
    const step = steps[stepIndex];
    const fieldCount = step.fields.length + 1;
    const newField: SchemaField = {
      field_key: `field_${Date.now()}_${fieldCount}`,
      field_type: type,
      label: type === "text" ? `Text Line ${fieldCount}` : "New Choice",
      is_required: true,
      display_order: fieldCount,
      placeholder: "Enter details…",
      ...(type === "color_swatch" || type === "scent_selector" || type === "dropdown" ? { options: [] } : {})
    };
    const newSteps = steps.map((s, i) => 
      i === stepIndex ? { ...s, fields: [...s.fields, newField] } : s
    );
    onChange(newSteps);
  };

  const removeField = (stepIndex: number, fieldIndex: number) => {
    const newSteps = steps.map((s, i) => {
      if (i === stepIndex) {
        return { ...s, fields: s.fields.filter((_, fi) => fi !== fieldIndex) };
      }
      return s;
    });
    onChange(newSteps);
  };

  const updateField = (stepIndex: number, fieldIndex: number, data: Partial<SchemaField>) => {
    const newSteps = steps.map((s, i) => {
      if (i === stepIndex) {
        const newFields = s.fields.map((f, fi) => (fi === fieldIndex ? { ...f, ...data } : f));
        return { ...s, fields: newFields };
      }
      return s;
    });
    onChange(newSteps);
  };

  // adding/editing options
  const addOption = (stepIndex: number, fieldIndex: number) => {
    const newSteps = steps.map((s, i) => {
      if (i === stepIndex) {
        const newFields = s.fields.map((f, fi) => {
          if (fi === fieldIndex) {
            const opts = f.options ? [...f.options] : [];
            opts.push({ label: "New Option", value: `opt_${Date.now()}`, hexColor: "#000000" });
            return { ...f, options: opts };
          }
          return f;
        });
        return { ...s, fields: newFields };
      }
      return s;
    });
    onChange(newSteps);
  };

  const updateOption = (stepIndex: number, fieldIndex: number, optIndex: number, data: any) => {
    const newSteps = steps.map((s, i) => {
      if (i === stepIndex) {
        const newFields = s.fields.map((f, fi) => {
          if (fi === fieldIndex && f.options) {
            const opts = f.options.map((o, oi) => oi === optIndex ? { ...o, ...data } : o);
            if (data.hexColor) {
               opts[optIndex].value = data.hexColor;
            }
            return { ...f, options: opts };
          }
          return f;
        });
        return { ...s, fields: newFields };
      }
      return s;
    });
    onChange(newSteps);
  };

  const removeOption = (stepIndex: number, fieldIndex: number, optIndex: number) => {
    const newSteps = steps.map((s, i) => {
      if (i === stepIndex) {
        const newFields = s.fields.map((f, fi) => {
          if (fi === fieldIndex && f.options) {
            return { ...f, options: f.options.filter((_, oi) => oi !== optIndex) };
          }
          return f;
        });
        return { ...s, fields: newFields };
      }
      return s;
    });
    onChange(newSteps);
  };

  const templates = getTemplates();

  return (
    <div className="customization-builder space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/90 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Customization Stages
        </h3>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs font-bold text-purple-400 transition-all focus:outline-none"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Stage
            <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-60" />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden text-left animation-slide-down">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/30 border-b border-white/5 bg-white/[0.02]">
                Template Categories
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {templates.map(t => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => addStepFromTemplate(t.step)}
                      className="w-full flex items-start gap-3 p-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                    >
                      <div className="mt-0.5 p-1.5 rounded-md bg-white/5 text-purple-400 shadow-sm border border-purple-500/30">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white/90">{t.label}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">{t.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, sIdx) => (
          <div key={sIdx} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-sm group">
            {/* Step Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
              <div className="flex-grow flex items-center gap-4">
                <GripVertical className="w-4 h-4 text-white/20 cursor-grab active:cursor-grabbing" />
                <div className="space-y-1 flex-grow pr-4">
                   <input 
                     value={step.title} 
                     onChange={e => updateStep(sIdx, { title: e.target.value })}
                     className="bg-transparent border-none text-white font-bold focus:ring-0 w-full p-0"
                     placeholder="Stage Title (e.g., Personalize Your Card)"
                   />
                   <input 
                     value={step.description || ''} 
                     onChange={e => updateStep(sIdx, { description: e.target.value })}
                     className="bg-transparent border-none text-white/40 text-[11px] focus:ring-0 w-full p-0 mt-1"
                     placeholder="Instructions for user (optional)"
                   />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeStep(sIdx)}
                className="p-2 text-white/20 hover:text-red-400 transition-colors"
                title="Remove Stage"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Fields List */}
            <div className="p-4 space-y-4">
              {step.fields.map((field, fIdx) => (
                <div key={field.field_key} className="flex flex-col bg-black/20 rounded-lg border border-white/5 hover:border-white/10 transition-all overflow-hidden">
                  <div className="flex items-start gap-4 p-3 group/field">
                    <div className="flex flex-col items-center gap-2 pt-1.5 opacity-20 group-hover/field:opacity-50 transition-opacity">
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-grow">
                       {/* Label & Type */}
                       <div className="md:col-span-5 space-y-1">
                          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Field Name / Label</label>
                          <input 
                            value={field.label}
                            onChange={e => updateField(sIdx, fIdx, { label: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-purple-500/50 outline-none transition-colors"
                            placeholder="e.g. Card Greeting"
                          />
                       </div>

                       <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Input Type</label>
                          <div className="relative">
                            <select
                              value={field.field_type}
                              onChange={e => updateField(sIdx, fIdx, { field_type: e.target.value as FieldType })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:border-purple-500/50 outline-none appearance-none transition-colors"
                            >
                              {FIELD_TYPES.map(ft => (
                                <option key={ft.type} value={ft.type}>{ft.label}</option>
                              ))}
                            </select>
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                               {(() => {
                                 const Icon = FIELD_TYPES.find(f => f.type === field.field_type)?.icon || Type;
                                 return <Icon className="w-3.5 h-3.5" />;
                               })()}
                            </div>
                          </div>
                       </div>

                       <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Placeholder</label>
                          <input 
                            value={field.placeholder || ''}
                            onChange={e => updateField(sIdx, fIdx, { placeholder: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-purple-500/50 outline-none transition-colors"
                            placeholder="Hint text…"
                          />
                       </div>
                       
                       <div className="md:col-span-1 flex items-end justify-end pb-1.5">
                          <button
                            type="button"
                            onClick={() => removeField(sIdx, fIdx)}
                            className="p-2 text-white/20 hover:text-red-400 transition-colors"
                            title="Remove Field"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>

                       {/* Options Section (conditionally rendered) */}
                       {(field.field_type === 'color_swatch' || field.field_type === 'scent_selector' || field.field_type === 'dropdown' || field.field_type === 'ribbon_selector') && (
                         <div className="md:col-span-12 space-y-2 pt-3 border-t border-white/5 mt-2">
                           <div className="flex items-center justify-between pb-1">
                             <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Selection Options</label>
                             <button
                               type="button"
                               onClick={() => addOption(sIdx, fIdx)}
                               className="text-[10px] font-bold px-2 py-1 bg-white/5 rounded text-purple-400 hover:text-purple-300 hover:bg-white/10 transition-colors flex items-center gap-1"
                             >
                               <Plus className="w-3 h-3" /> Add Option
                             </button>
                           </div>
                           
                           <div className="space-y-2">
                             {(field.options || []).map((opt, oIdx) => (
                               <div key={oIdx} className="flex flex-wrap items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                                 <input
                                   value={opt.label}
                                   onChange={e => updateOption(sIdx, fIdx, oIdx, { label: e.target.value })}
                                   placeholder="Label (e.g. Pure White)"
                                   className="flex-grow min-w-[120px] bg-black/20 border border-white/10 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-purple-500/50"
                                 />
                                 {(field.field_type === 'color_swatch' || field.field_type === 'ribbon_selector') && (
                                   <div className="flex items-center gap-2 shrink-0 bg-black/20 border border-white/10 rounded px-2 py-1">
                                     <input
                                       type="color"
                                       value={opt.hexColor || '#000000'}
                                       onChange={e => updateOption(sIdx, fIdx, oIdx, { hexColor: e.target.value })}
                                       className="w-5 h-5 rounded cursor-pointer shrink-0 bg-transparent border-none p-0"
                                     />
                                     <span className="text-[10px] font-mono text-white/50 w-16">{opt.hexColor || '#000000'}</span>
                                   </div>
                                 )}
                                 {field.field_type === 'scent_selector' && (
                                   <input
                                     value={opt.icon || ''}
                                     onChange={e => updateOption(sIdx, fIdx, oIdx, { icon: e.target.value })}
                                     placeholder="Emoji"
                                     className="w-16 bg-black/20 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none text-center focus:border-purple-500/50"
                                     title="Icon or Emoji"
                                   />
                                 )}
                                 <button
                                   type="button"
                                   onClick={() => removeOption(sIdx, fIdx, oIdx)}
                                   className="p-1.5 text-white/20 hover:text-red-400 transition-colors shrink-0 ml-auto"
                                   title="Remove Option"
                                 >
                                   <Trash2 className="w-3.5 h-3.5" />
                                 </button>
                               </div>
                             ))}
                             {(!field.options || field.options.length === 0) && (
                               <div className="text-xs italic text-white/30 px-2 py-1">No options added yet.</div>
                             )}
                           </div>
                         </div>
                       )}

                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 pl-2">
                 <button
                   type="button"
                   onClick={() => addField(sIdx)}
                   className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-colors"
                 >
                   <Plus className="w-3.5 h-3.5 p-0.5 border border-dashed border-white/40 rounded-sm" />
                   Add another field to this stage
                 </button>
              </div>
            </div>
          </div>
        ))}

        {steps.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-xl bg-white/[0.02] text-center space-y-4">
             <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                <Sparkles className="w-5 h-5" />
             </div>
             <div className="space-y-1">
                <p className="text-sm font-medium text-white/60">No customisation stages yet.</p>
                <p className="text-[11px] text-white/30">Click "Add Stage" or use the dropdown to pick from professionally made templates.</p>
             </div>
             <button
               type="button"
               onClick={() => setMenuOpen(true)}
               className="btn-primary-sm mt-2"
             >
                ＋ Browse Templates
             </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .btn-primary-sm {
           padding: 0.5rem 1rem;
           background: linear-gradient(135deg, #a855f7, #6366f1);
           border-radius: 8px;
           color: white;
           font-size: 0.75rem;
           font-weight: 700;
           cursor: pointer;
           border: none;
           transition: opacity 0.2s;
        }
        .btn-primary-sm:hover { opacity: 0.9; }
        
        .animation-slide-down {
          animation: slideDown 0.15s ease-out forwards;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
