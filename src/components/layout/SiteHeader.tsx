"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Shop", href: "/shop" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Blog", href: "/blog" },
  { name: "Partnerships", href: "/wholesale" },
  { name: "About", href: "/about" },
];

export default function SiteHeader() {
  const { getTotalItems, toggleCart } = useCart();
  const itemCount = getTotalItems();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm" 
          : "bg-transparent"
      )}
    >
      {/* Announcement Bar */}
      <div className="w-full bg-[var(--color-accent-emerald)] text-white text-[10px] font-bold uppercase tracking-[0.2em] py-2 flex items-center justify-center gap-2">
        <span className="text-[var(--color-accent-gold)]">✧</span>
        <span>Complimentary Expedited Shipping on Bespoke Orders Over $250</span>
        <span className="text-[var(--color-accent-gold)]">✧</span>
      </div>

      <div className={cn(
        "container mx-auto px-4 md:px-6 flex items-center justify-between transition-all duration-500",
        isScrolled ? "py-4" : "py-6"
      )}>
        {/* Logo */}
        <Link 
          href="/" 
          className="font-serif text-2xl font-black text-accent tracking-tighter hover:text-primary transition-colors flex items-center space-x-2"
        >
          <span className={cn(isScrolled ? "text-accent" : "text-accent")}>
            Celebration<span className="text-primary italic font-medium">Finds</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-12">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative py-2"
            >
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
                isScrolled ? "text-accent/70 hover:text-accent" : "text-accent/80 hover:text-accent"
              )}>
                {link.name}
              </span>
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-[1.5px] bg-primary origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </Link>
          ))}
        </nav>

        {/* Action Bar */}
        <div className="flex items-center space-x-6">
          <Link href="/account" className="relative p-2 rounded-full hover:bg-slate-50 transition-colors group">
            <User className="w-5 h-5 text-accent group-hover:text-primary transition-colors" />
          </Link>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleCart}
            className="flex items-center space-x-2 group relative"
          >
            <div className="relative p-2 rounded-full hover:bg-slate-50 transition-colors">
              <ShoppingBag className="w-5 h-5 text-accent group-hover:text-primary transition-colors" />
              {mounted && itemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[9px] flex items-center justify-center font-bold rounded-full border border-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </div>
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-accent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-serif font-bold text-accent hover:text-primary transition-colors py-2 border-b border-slate-50"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-serif font-bold text-accent hover:text-primary transition-colors py-2"
              >
                My Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
