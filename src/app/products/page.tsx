import { products } from "@/db/products";
import ProductClient from "./components/ProductClient";

const ProductPage = () => {
  return <ProductClient products={products} />;
};

export default ProductPage;
