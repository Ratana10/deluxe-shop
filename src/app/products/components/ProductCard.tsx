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

  const getBannerColor = (status: string) => {
    switch (status) {
      case "Out of stock":
        return "bg-[#660404] text-white";
      case "Coming soon":
        return "bg-gray-500 text-white";
      default:
        return "text-white";
    }
  };

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
        <div className="relative w-full h-[300px] sm:h-[250px] md:h-[400px] lg:h-[300px] overflow-hidden rounded-lg shadow-sm">
          <Image
            src={product.images[0] || "/img/no-image.png"}
            alt={product.name}
            fill
            className="rounded-lg object-cover border"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          {(product.status === "Out of stock" ||
            product.status === "Coming soon") && (
            <div className="absolute inset-x-0 bottom-0 flex justify-center items-center overflow-hidden">
              <div
                className={`w-full opacity-50 text-lg font-bold px-6 py-3 text-center ${getBannerColor(
                  product.status
                )}`}
              >
                {product.status}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4">
        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <motion.h4
            whileHover={{ color: "#AB8529", scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="text-lg md:text-xl  font-semibold text-[#660404]"
          >
            {product.name}
          </motion.h4>
        </Link>

        {/* Price and View Detail Button */}
        <div className="flex justify-between items-end mt-2">
          {/* Product Price */}
          <span className="text-base font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>

          {/* Stock Status */}
          {/* Banner for Out of Stock and Coming Soon */}
          {/* <span
            className={`ml-auto px-2 py-1 rounded-sm text-sm ${
              product.status === "Available"
                ? "bg-[#AB8529] text-white"
                : product.status === "Out of stock"
                ? "bg-[#660404] text-white"
                : " bg-gray-500 text-white"
            }`}
          >
            {product.status}
          </span> */}
        </div>
      </div>
    </motion.div>
  );
}
