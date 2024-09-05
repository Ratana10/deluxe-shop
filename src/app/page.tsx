import { getProducts } from "@/service/product.service";
import ProductClient from "./products/components/ProductClient";
import Client from "./(root)/components/Client";

export default async function Home() {
  const products = await getProducts();
  return <Client />
}
