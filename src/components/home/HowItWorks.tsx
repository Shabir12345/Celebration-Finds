import { PenTool, Box, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Sparkles,
    title: "Select Your Piece",
    description: "Browse our curated collection of luxury party favours, from handcrafted candles to bespoke keepsakes.",
    step: "01"
  },
  {
    icon: PenTool,
    title: "Personalize It",
    description: "Use our real-time builder to choose scents, colours, and custom engravings that tell your story.",
    step: "02"
  },
  {
    icon: Box,
    title: "The Celebration",
    description: "Your custom pieces are handcrafted, beautifully packaged, and delivered to elevate your special day.",
    step: "03"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white skew-y-3 origin-top-left -translate-y-20 border-b border-slate-100" />
      
      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center space-y-20">
        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">The Process</p>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-accent tracking-tighter leading-none">
            From Vision to <span className="italic text-primary">Celebration</span>
          </h2>
          <p className="font-sans text-sm md:text-base text-slate-500 font-medium tracking-wide leading-relaxed">
            Our artisan-led approach ensures each piece is as unique as the celebration it marks. Three simple steps to bespoke elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group text-center space-y-8">
              <div className="relative">
                <p className="absolute -top-10 left-1/2 -translate-x-1/2 font-serif text-8xl md:text-9xl font-bold text-slate-100/60 group-hover:text-primary/10 transition-colors duration-500">
                  {step.step}
                </p>
                <div className="relative z-10 w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-xl group-hover:-translate-y-2 transition-transform duration-500">
                  <step.icon className="w-10 h-10 text-accent group-hover:text-primary transition-colors duration-500" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-accent group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-[250px] mx-auto tracking-wide">
                  {step.description}
                </p>
              </div>
              
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px border-t border-dashed border-slate-200 -translate-x-10 translate-y-12" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
