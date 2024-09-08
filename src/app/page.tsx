import { getProducts } from "@/service/product.service";
import Client from "./(root)/components/Client";
import { CartProvider } from "./context/CartContext";

export default async function Home() {
  const products = await getProducts();
  return <Client />;
}
