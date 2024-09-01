import ProductClient from "./components/ProductClient";
import { getProducts } from "@/service/product.service";
import { Product } from "@/types";

const ProductPage = async () => {
  const products = await getProducts();

  return <ProductClient products={products} />;
};

export default ProductPage;
