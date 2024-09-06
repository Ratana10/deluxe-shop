"use client";

import Image from "next/image";
import { Product } from "@/types";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9, rotate: 2 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, rotate: 0 } : {}} // Animate when the card comes into view
      transition={{ duration: 0.7, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      className="px-1 max-w-sm  transition-shadow transform-gpu"
    >
      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full h-[400px] md:h-[300px]  overflow-hidden rounded-lg shadow-sm">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="rounded-lg object-cover border"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4">
        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <motion.h2
            whileHover={{ color: "#AB8529", scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-semibold text-[#660404]"
          >
            {product.name}
          </motion.h2>
        </Link>

        {/* Price and View Detail Button */}
        <div className="flex justify-between items-end mt-2">
          {/* Product Price */}
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>

          {/* View Detail Button */}
          <Link href={`/products/${product.id}`} className="ml-auto">
            <button className="btn-primary">View Detail</button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
