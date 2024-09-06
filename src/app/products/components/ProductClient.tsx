"use client";

import React from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { motion } from "framer-motion";

interface Props {
  products: Product[] | null;
}

const ProductClient = ({ products }: Props) => {
  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto text-center py-4">
        <h2 className="text-xl font-semibold text-gray-700">
          No products available
        </h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.1, // Stagger animation for each product
              delayChildren: 0.2, // Start animation after delay
            },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </div>
  );
};

export default ProductClient;
