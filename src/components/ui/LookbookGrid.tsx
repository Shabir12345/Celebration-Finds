import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface PortfolioCardProps {
  id: string;
  imageUrl: string;
  title: string;
  client?: string;
  size?: "1x1" | "1x2" | "2x2";
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  imageUrl,
  title,
  client,
  size = "1x1",
}) => {
  // Translate size string to CSS grid spans
  const sizeClasses = {
    "1x1": "col-span-1 row-span-1 aspect-square",
    "1x2": "col-span-1 row-span-2 min-h-[500px]",
    "2x2": "col-span-2 row-span-2 min-h-[500px]",
  };

  return (
    <div className={cn("group relative w-full h-full overflow-hidden cursor-pointer", sizeClasses[size])}>
      {/* Editorial Image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] group-hover:scale-105"
        sizes="(max-width: 1024px) 50vw, 25vw"
      />
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-black/5 luxury-transition group-hover:bg-black/20" />
      
      {/* Content strictly centered for high editorial feel */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 luxury-transition">
        <h3 className="text-h2 font-serif text-white tracking-wide mix-blend-overlay drop-shadow-md mb-2 translate-y-4 group-hover:translate-y-0 luxury-transition">
          {title}
        </h3>
        {client && (
          <span className="text-[12px] font-sans text-white/90 uppercase tracking-[0.2em] transform translate-y-4 group-hover:translate-y-0 luxury-transition delay-75">
            {client}
          </span>
        )}
      </div>
    </div>
  );
};

export interface LookbookGridProps {
  items: PortfolioCardProps[];
}

export const LookbookGrid: React.FC<LookbookGridProps> = ({ items }) => {
  return (
    <div className="w-full grid grid-flow-row-dense grid-cols-2 lg:grid-cols-4 gap-1 p-1 bg-white">
      {items.map((item) => (
        <PortfolioCard key={item.id} {...item} />
      ))}
    </div>
  );
};
