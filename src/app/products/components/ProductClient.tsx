import React from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[] | null;
}

const ProductClient = ({ products }: Props) => {
  return (
    <div className="container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  gap-4 ">
      {products?.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductClient;
