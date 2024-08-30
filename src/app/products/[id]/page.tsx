import { products } from "@/db/products";
import ProductClient from "./components/ProductClient";

const ProductIdPage = ({ params }: { params: { id: string } }) => {
  const product = products.find((product) => product.id === params.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <ProductClient product={product} />
    </>
  );
};

export default ProductIdPage;
