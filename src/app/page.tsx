import { getProducts } from "@/service/product.service";
import ProductClient from "./products/components/ProductClient";

export default async function Home() {
  const products = await getProducts();
  return <ProductClient products={products} />;
}
