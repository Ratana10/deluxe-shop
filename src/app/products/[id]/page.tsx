import { notFound } from "next/navigation";
import ProductClient from "./components/ProductClient";
import { getProductById } from "@/service/product.service";

const ProductIdPage = async ({ params }: { params: { id: string } }) => {
  const product = await getProductById(params.id);

  if (!product) {
    return notFound();
  }
  return (
    <>
      <ProductClient product={product} />
    </>
  );
};

export default ProductIdPage;
