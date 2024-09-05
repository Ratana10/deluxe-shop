import Image from "next/image";
import { Product } from "@/types";
import Link from "next/link";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  return (
    <div className="px-1 max-w-sm  transition-shadow">
      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full h-[400px] md:h-[300px]  overflow-hidden rounded-lg shadow-sm">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="rounded-lg object-cover border"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4">
        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h2 className="text-lg font-semibold text-[#660404]">
            {product.name}
          </h2>
        </Link>

        {/* Price and View Detail Button */}
        <div className="flex justify-between items-end mt-2">
          {/* Product Price */}
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>

          {/* View Detail Button */}
          <Link href={`/products/${product.id}`} className="ml-auto">
            <button className="bg-[#AB8529] text-white px-3 py-2 rounded-md text-sm hover:bg-[#AB8529] transition-all">
              View Detail
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
