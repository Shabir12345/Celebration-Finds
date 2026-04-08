"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { urlFor } from "@/lib/sanity";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  image: any; // Accept sanity image object or string
  isFeatured?: boolean;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  category,
  image,
  isFeatured = false,
}: ProductCardProps) {
  const defaultImage = "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80";
  const imageUrl = image 
    ? (typeof image === "string" ? image : urlFor(image).width(600).url())
    : defaultImage;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="group relative flex flex-col space-y-4"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl">
        <Link href={`/shop/${slug}`} className="block w-full h-full relative">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {isFeatured && (
            <div className="absolute top-4 left-4 bg-[var(--color-brand-blush)] px-3 py-1 text-[10px] uppercase font-bold text-[var(--color-accent-navy)] tracking-widest shadow-lg">
              Featured
            </div>
          )}
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent-navy)]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 luxury-transition flex flex-col justify-end p-6">
            <div className="bg-white/95 backdrop-blur-md px-6 py-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 luxury-transition shadow-xl flex items-center justify-center space-x-2 rounded-sm border border-[var(--color-border-subtle)]">
              <Plus className="w-4 h-4 text-[var(--color-accent-gold)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-primary)]">Quick Customize</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Product Details */}
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-tertiary)] font-sans">
            {category}
          </p>
          <p className="font-serif text-lg font-bold text-[var(--color-text-primary)]">
            From ${(price || 0).toFixed(2)}
          </p>
        </div>
        <Link href={`/shop/${slug}`} className="block">
          <h3 className="font-serif text-2xl font-bold text-[var(--color-text-primary)] tracking-tight group-hover:text-[var(--color-accent-gold)] luxury-transition">
            {name}
          </h3>
        </Link>
      </div>
    </motion.div>
  );
}
