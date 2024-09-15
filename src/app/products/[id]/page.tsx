import { notFound } from "next/navigation";
import ProductClient from "./components/ProductClient";
import { getProductById, getProducts } from "@/service/product.service";
import { Metadata } from "next";

interface Props {
  params: { id: string };
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  
  const product = await getProductById(params.id);

  if (!product) {
    return notFound();
  }

  return {
    title: product?.name,
    description: product?.description,
    openGraph: {
      images: [{
        url: product?.images[0]
      }],
    },
  }
}


export async function generateStaticParams() {
  const products = await getProducts();
 
  return products.map(({id}) => id).slice(0, 5);
}


const ProductIdPage = async ({ params }: Props) => {
  const product = await getProductById(params.id);

  if (!product) {
    return notFound();
  }
  return <ProductClient product={product} />;
};

export default ProductIdPage;
