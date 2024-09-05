import ProductClient from "./components/ProductClient";
import { getProducts } from "@/service/product.service";
import { Suspense } from "react";

const ProductPage = async () => {
  const products = await getProducts();

  return <ProductClient products={products} />;
};

export default ProductPage;
