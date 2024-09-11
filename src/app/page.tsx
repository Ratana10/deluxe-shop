import { getProducts } from "@/service/product.service";
import Client from "./components/Client";

export default async function Home() {
  const products = await getProducts();

  return <Client products={products} />;
}
