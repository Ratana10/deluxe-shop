import { products } from "@/db/products";
import ProductClient from "./products/components/ProductClient";


export default function Home() {
  return (
    <ProductClient products={products} />
  );
}
