import { Product } from "@/types";
import ProductDetail from "./ProductDetail";


interface Props {
  product: Product;
}

export default function ProductClient({ product }: Props) {

  return (
    <ProductDetail product={product} />
  );
}
