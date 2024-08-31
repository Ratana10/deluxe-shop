import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  return (
    <Card className="w-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="relative w-full h-[300px]">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            className="rounded-t-lg object-cover"
          />
        </Link>
      </div>
      <CardContent className="p-3">
        <Label className="text-xl font-semibold">{product.name}</Label>
        <div className="flex items-center justify-between">
          <Label className="leading-loose text-sm">
            Price: <span>$ {product.price}</span>
          </Label>
          <Badge
            className={`${
              product.status === "Available" ? "bg-green-800" : "bg-red-500"
            }`}
          >
            {product.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
