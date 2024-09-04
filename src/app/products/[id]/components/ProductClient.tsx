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

// Define a color map
const colorMap: { [key: string]: string } = {
  Gold: "#D4AF37", // HEX for metallic gold
  Silver: "#C0C0C0", // Example for silver
  Red: "#FF0000", // Example for red
  // Add more colors as needed
};

interface Props {
  product: Product;
}

export default function ProductClient({ product }: Props) {
  const displayColor = colorMap[product.color] || product.color.toLowerCase();

  return (
    <div className="container mx-auto px-4 ">
      {/* Back Button */}
      <BackButton text="Back" />

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mt-6">
        {/* Carousel Section */}
        <div className="relative overflow-hidden rounded-lg border shadow-sm">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image: string, index: number) => (
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
              ))}
            </CarouselContent>
            {/* Carousel Navigation Buttons */}
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition" />
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition" />
          </Carousel>
        </div>

        {/* Product Details Section */}
        <div className="grid gap-6">
          <div className="flex flex-col">
            {/* Product Name */}
            <h1 className="font-bold text-3xl sm:text-4xl text-gray-800">
              {product.name}
            </h1>

            {/* Product Description */}
            <p className="text-gray-600 text-md sm:text-lg">
              {product.description}
            </p>

            {/*  Color Display */}
            <div className="flex items-center mt-4">
              <span className="text-sm font-medium mr-2">Color:</span>
              <Badge>{product.color}</Badge>
            </div>

            {/* Product Status */}
            <div className="mt-4">
              <Badge
                className={`${
                  product.status === "Available" ? "bg-green-600" : "bg-red-500"
                } text-white px-3 py-1 rounded-full`}
              >
                {product.status}
              </Badge>
            </div>

            {/* Separator */}
            <Separator className="my-4" />

            {/* Price Section */}
            <div className="flex items-center mt-2">
              <Label className="text-2xl font-bold text-gray-800">
                <span className="">Price:</span>
                <span className=" ml-2">${product.price}</span>
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
