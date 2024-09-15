import { Metadata } from "next";
import ProductClient from "./components/ProductClient";
import { getProducts } from "@/service/product.service";

export const metadata: Metadata = {
  title: "Products"
};

const ProductPage = async () => {
  const products = await getProducts();

  return <ProductClient products={products} />;
};

export default ProductPage;
