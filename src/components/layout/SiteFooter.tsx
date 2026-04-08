"use client";

import Link from "next/link";
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

const shopLinks = [
  { name: "Shop", href: "/shop" },
  { name: "The Lookbook", href: "/portfolio" },
  { name: "Wholesale & Partners", href: "/wholesale" },
  { name: "Our Story", href: "/about" },
  { name: "FAQ", href: "/faq" },
];

const brandLinks = [
  { name: "Our Story", href: "/about" },
  { name: "Lookbook", href: "/portfolio" },
  { name: "Wholesale & B2B", href: "/wholesale" },
  { name: "Partnerships", href: "/partnerships" },
  { name: "Blog", href: "/blog" },
];

const supportLinks = [
  { name: "FAQ", href: "/faq" },
  { name: "Shipping & Returns", href: "/shipping" },
  { name: "Contact Us", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

export default function SiteFooter() {
  return (
    <footer className="w-full bg-[var(--color-accent-navy)] text-white pt-24 pb-10 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Newsletter / Lead Capture */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 mb-20 backdrop-blur-sm">
          <div className="max-w-xl mb-8 md:mb-0">
            <h2 className="font-serif text-3xl font-bold text-white mb-3">Join the Private Ledger</h2>
            <p className="text-white/60 font-light text-sm leading-relaxed max-w-md">
              Receive exclusive access to limited-edition collections, sophisticated gifting advice, and 10% off your initial bespoke curation.
            </p>
          </div>
          <form className="w-full md:w-auto flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="bg-transparent border border-white/20 text-white placeholder:text-white/40 px-6 py-4 rounded-sm focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/60 min-w-[280px] luxury-transition"
            />
            <button 
              type="submit"
              className="bg-white text-[var(--color-accent-navy)] px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-white/90 luxury-transition rounded-sm"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-3xl font-bold tracking-tight text-white group-hover:gold-foil-text transition-all duration-300">
                Celebration Finds
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm font-light">
              We believe that every celebration should have a little bit of magic. Our beautiful handmade gifts and premium party favors are made to turn your big days into happy, lifelong memories.
            </p>
            <div className="flex items-center space-x-5">
              <Link href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all duration-300" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all duration-300" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all duration-300" aria-label="Mail">
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Navigation</h3>
            <ul className="space-y-4">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 font-light text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand/B2B */}
          <div className="space-y-8">
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Business</h3>
            <ul className="space-y-4">
              {brandLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 font-light text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-8">
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Our Studio</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 text-sm font-light">
                <MapPin className="w-4 h-4 text-[var(--color-accent-gold)] shrink-0 mt-0.5" />
                <span>Toronto, Ontario, Canada</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm font-light">
                <Mail className="w-4 h-4 text-[var(--color-accent-gold)]" />
                <span>hello@celebrationfinds.com</span>
              </li>
              <li className="pt-4">
                 <Link href="/faq" className="text-[var(--color-accent-gold)] text-xs font-semibold tracking-widest uppercase hover:underline underline-offset-4">
                   View Help Center →
                 </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-white/10 pt-10 flex flex-col lg:flex-row items-center justify-between text-[10px] text-white/40 uppercase tracking-[0.2em] gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p>© {new Date().getFullYear()} Celebration Finds. Handcrafted with Care.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/admin/login" className="hover:text-white transition-colors flex items-center gap-1.5 opacity-40 hover:opacity-100 border-l border-white/10 pl-4">
                Admin Login
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <span className="w-1 h-1 bg-[var(--color-accent-gold)] rounded-full animate-pulse"></span>
              <span>Safe Checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1 h-1 bg-[var(--color-accent-gold)] rounded-full animate-pulse"></span>
              <span>Global Logistics</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
