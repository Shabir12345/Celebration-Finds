"use client";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import InquiryFormClient from "@/components/inquiry/InquiryFormClient";
import { motion } from "framer-motion";
import { Layers, Zap, Heart, Truck } from "lucide-react";

const valueProps = [
    {
        title: "A Part of Your Team",
        description: "We work smoothly behind the scenes. We provide handmade items that make you look like a superstar to your clients.",
        icon: Layers
    },
    {
        title: "Special Pricing",
        description: "Our partners get great wholesale prices. You also skip the waiting line with our fast-track production times.",
        icon: Zap
    },
    {
        title: "Your Own Branding",
        description: "For corporate accounts or galas, we offer white-label options. Put your client's logo and colors on our gifts.",
        icon: Heart
    },
    {
        title: "Reliable Shipping",
        description: "Your gifts are insured against breaking in the mail. We use careful, earth-friendly delivery services.",
        icon: Truck
    }
];

export default function WholesalePage() {
  return (
    <main className="flex-grow">
      {/* B2B Hero */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-slate-900 border-b border-white/10">
          <div 
              className="absolute inset-0 bg-cover bg-center brightness-50 contrast-125"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
              <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto space-y-8"
              >
                  <div className="space-y-4">
                      <h2 className="text-secondary font-sans text-xs md:text-sm font-bold uppercase tracking-[0.3em] drop-shadow-md">
                          Partnerships & Wholesale
                      </h2>
                      <h1 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tight leading-tight">
                          Give Your Clients <span className="italic text-secondary">the Best</span>
                      </h1>
                      <p className="text-slate-300 font-sans text-sm md:text-lg max-w-2xl mx-auto font-medium tracking-wide leading-relaxed">
                          Partner with Celebration Finds to bring beautiful, custom luxury to your corporate events, big weddings, and VIP gifting.
                      </p>
                  </div>
              </motion.div>
          </div>
      </section>

      {/* Value Prop Grid */}
      <section className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                  {valueProps.map((prop, idx) => {
                      const Icon = prop.icon;
                      return (
                          <motion.div 
                              key={prop.title}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="space-y-4 text-center md:text-left group"
                          >
                              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-accent group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-xl">
                                  <Icon className="w-6 h-6" />
                              </div>
                              <h3 className="font-serif text-xl font-bold text-accent tracking-tight">{prop.title}</h3>
                              <p className="text-slate-500 text-sm font-medium tracking-wide leading-relaxed">{prop.description}</p>
                          </motion.div>
                      );
                  })}
              </div>
          </div>
      </section>

      {/* Inquiry Form Section */}
      <section className="py-24 bg-muted relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                  {/* Left content: Branding & FAQs */}
                  <div className="space-y-12">
                      <div className="space-y-6">
                          <h2 className="font-serif text-4xl md:text-5xl font-bold text-accent tracking-tighter">Your Vision, <span className="italic text-primary">Our Craft.</span></h2>
                          <p className="text-slate-500 text-base md:text-lg font-medium tracking-wide max-w-md">
                              From curated gift sets to delicate, individual favours, we work as an extension of your creative team.
                          </p>
                      </div>

                      {/* Process Checklist */}
                      <div className="space-y-6">
                          {[
                              { t: "Step 1: Say Hello", d: "Tell our team about your event date, theme, and how many items you need." },
                              { t: "Step 2: See Your Design", d: "We will send you pictures or physical samples to make sure you love the look." },
                              { t: "Step 3: Made with Care", d: "Our expert makers handcraft every piece in our sunny Toronto studio." },
                              { t: "Step 4: Safe Arrival", d: "We ship your insured gifts directly to your venue so you have zero stress." }
                          ].map((step, idx) => (
                              <div key={idx} className="flex space-x-6 items-start group">
                                  <span className="font-serif text-2xl font-bold text-slate-200 group-hover:text-primary transition-colors italic">0{idx + 1}</span>
                                  <div className="space-y-1">
                                      <h4 className="font-serif text-lg font-bold text-accent tracking-tight">{step.t}</h4>
                                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{step.d}</p>
                                  </div>
                              </div>
                          ))}
                      </div>

                      <div className="p-8 bg-white border border-slate-100 shadow-sm space-y-2">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Need a rapid quote?</p>
                           <p className="font-serif text-lg font-bold text-accent tracking-tight underline">wholesale@celebrationfinds.ca</p>
                      </div>
                  </div>

                  {/* Right side: The Inquiry Form */}
                  <InquiryFormClient />
              </div>
          </div>
          {/* Background Decor */}
          <div className="absolute bottom-0 right-0 w-1/2 h-full bg-primary/2 -skew-x-12 transform translate-x-1/2" />
      </section>
    </main>
  );
}
