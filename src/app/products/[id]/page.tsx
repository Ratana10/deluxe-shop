import ProductClient from "./components/ProductClient";
import { getProductById } from "@/service/product.service";

const ProductIdPage = async ({ params }: { params: { id: string } }) => {
  const product = await getProductById(params.id);

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
