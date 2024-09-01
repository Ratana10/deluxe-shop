"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import BackButton from "@/components/BackButton";

interface Props {
  product: Product;
}

export default function ProductClient({ product }: Props) {
  return (
    <div className="container">
      <BackButton text="Back" />
      <div className="grid md:grid-cols-2 gap-4 lg:gap-12">
        <div className="relative overflow-hidden rounded-lg">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image: string, index: number) => {
                return (
                  <CarouselItem
                    key={index}
                    className="relative h-[400px] md:h-[600px]"
                  >
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2" />
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2" />
          </Carousel>
        </div>
        {/* Product Details Section */}
        <div className="grid gap-2 md:gap-10 order-1 md:order-2">
          <div className="flex flex-col">
            <div className="grid gap-4 md:gap-11">
              <h1 className="font-bold text-2xl sm:text-3xl">{product.name}</h1>
              <p className="text-sm">{product.description}</p>
              <div className="flex flex-wrap">
                <Label className="text-xl mr-3">Color</Label>
                <button className="border-2 border-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>
                <button className="border-2 border-gray-300 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
                <button className="border-2 border-gray-300 ml-1 bg-red-500 rounded-full w-6 h-6 focus:outline-none"></button>
              </div>
              <div className="flex">
                <Badge
                  className={`${
                    product.status === "Available"
                      ? "bg-green-800"
                      : "bg-red-500"
                  }`}
                >
                  {product.status}
                </Badge>
              </div>
              <Separator />
              <div className="flex">
                <Label className="text-xl">
                  price: <span>$ {product.price}</span>
                </Label>
                <Label className="text-xl ml-10"></Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
