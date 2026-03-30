"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  image: string;
  isFeatured?: boolean;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 w-full">
      {products.map((product, idx) => (
        <ProductCard
          key={product.slug}
          id={product.id}
          name={product.name}
          slug={product.slug}
          price={product.price}
          category={product.category}
          image={product.image}
          isFeatured={product.isFeatured}
        />
      ))}
    </div>
  );
}
