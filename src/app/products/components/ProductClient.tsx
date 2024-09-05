import React from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";

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
    <div className="container mx-auto px-4 py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductClient;
