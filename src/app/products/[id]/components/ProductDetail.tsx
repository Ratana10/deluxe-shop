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
import { useState } from "react";

interface Props {
  product: Product;
}

const ProductDetail = ({ product }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <BackButton text="Back" />

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mt-2">
        {/* Carousel Section */}
        <div className="relative overflow-hidden rounded-lg border shadow-sm">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image: string, index: number) => (
                <CarouselItem
                  key={index}
                  className="relative h-[400px] md:h-[600px]"
                  onClick={() => openModal(index)} // Open Modal on image click
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
            <h1 className="font-bold text-3xl sm:text-4xl text-[#660404]">
              {product.name}
            </h1>

            {/* Product Description */}
            <div className="my-6">
              <h3 className="text-lg font-semibold mb-2">Description:</h3>
              <p className="text-gray-600 text-md sm:text-lg">{product.description}</p>
            </div>

            {/*  Color Display */}
            <div className="flex items-center mt-4">
              <span className="text-sm font-medium mr-2">Color:</span>
              <Badge>{product.color}</Badge>
            </div>

            {/* Product Status */}
            {/* <div className="mt-4">
              <Badge
                className={`${
                  product.status === "Available" ? "bg-green-600" : "bg-red-500"
                } text-white px-3 py-1 rounded-full`}
              >
                {product.status}
              </Badge>
            </div> */}

            {/* Separator */}
            <Separator className="my-4" />

            {/* Price Section */}
            <div className="flex items-center mt-2">
              <Label className="text-2xl font-bold text-gray-800">
                <span className="">Price:</span>
                <span className=" ml-2">${product.price}</span>
              </Label>
            </div>

            {/* Modal for Full-size Image */}
            {isModalOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
                onClick={closeModal} // Close modal when clicking outside the image
              >
                <div
                  className="relative w-full max-w-4xl max-h-[90vh] overflow-auto"
                  onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
                >
                  {/* Carousel Inside Modal with Initial Index */}
                  <Carousel
                    className="w-full"
                    opts={{ startIndex: currentIndex }}
                  >
                    <CarouselContent>
                      {product.images.map((image: string, index: number) => (
                        <CarouselItem
                          key={index}
                          className="relative h-[500px] md:h-[600px]"
                        >
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {/* Carousel Navigation Buttons in Modal */}
                    <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/50 text-black p-2 rounded-full hover:bg-white/70 transition" />
                    <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/50 text-black p-2 rounded-full hover:bg-white/70 transition" />
                  </Carousel>

                  {/* Close Button */}
                  <button
                    className="absolute top-4 right-4 text-white text-5xl font-bold "
                    onClick={closeModal}
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
