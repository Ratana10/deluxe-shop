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
import { KeyboardEvent, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/app/context/CartContext";
import { toast } from "react-hot-toast";

interface Props {
  product: Product;
}

const ProductDetail = ({ product }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const { addToCart } = useCart();

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onAddToCart = (product: Product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || "",
    };

    addToCart(cartItem);
    toast.success(`Added to cart!`);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        when: "beforeChildren", // Ensures children animations start after container
        staggerChildren: 0.2, // Stagger each child by 0.2s
      },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  const handleKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (!isModalOpen) {
        if (event.key === "ArrowLeft") {
          document.getElementById("carousel-previous")?.click();
        } else if (event.key === "ArrowRight") {
          document.getElementById("carousel-next")?.click();
        }
      } else {
        if (event.key === "ArrowLeft") {
          document.getElementById("carousel-previous-modal")?.click();
        } else if (event.key === "ArrowRight") {
          document.getElementById("carousel-next-modal")?.click();
        }
      }
    },
    [isModalOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <BackButton text="Back" />

      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="grid md:grid-cols-2 gap-8 lg:gap-12 mt-2"
      >
        {/* Carousel Section */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-lg border shadow-sm"
        >
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
            <CarouselPrevious
              id="carousel-previous"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
            />
            <CarouselNext
              id="carousel-next"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
            />
          </Carousel>
        </motion.div>

        {/* Product Details Section */}
        <motion.div variants={itemVariants} className="grid gap-6">
          <div className="flex flex-col">
            {/* Product Name */}
            <h1 className="font-bold text-3xl sm:text-4xl text-[#660404]">
              {product.name}
            </h1>

            {/* Product Description */}
            <div className="my-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Description:</h3>
              <p className="text-gray-600 text-md sm:text-lg">
                {product.description}
              </p>
            </div>

            {/*  Color Display */}
            <div className="">
              <span className="text-lg sm:text-xl md:text-2xl font-bold">Color:</span>

              <div className="flex items-center space-x-2">
                {/* Display color name */}
                <span className="text-gray-600  text-md sm:text-lg">
                  {product.color}
                </span>

                {/* Circle with dynamic color */}
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: product.color.toLowerCase() }} // Dynamic color
                ></span>
              </div>
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
            <div className="flex items-center justify-between mt-2">
              <Label className="text-gray-800">
                <span className="text-lg sm:text-xl md:text-2xl font-bold">
                  Price:
                </span>
                <span className="ml-2 text-lg sm:text-xl md:text-2xl font-bold">
                  ${product.price}
                </span>
              </Label>
              <button
                className="btn-primary"
                onClick={() => onAddToCart(product)}
              >
                Add To Cart
              </button>
            </div>

            {/* Modal for Full-size Image */}
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
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
                    <CarouselPrevious
                      id="carousel-previous-modal"
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/50 text-black p-2 rounded-full hover:bg-white/70 transition"
                    />
                    <CarouselNext
                      id="carousel-next-modal"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/50 text-black p-2 rounded-full hover:bg-white/70 transition"
                    />
                  </Carousel>

                  {/* Close Button */}
                  <button
                    className="absolute top-4 right-4 text-white text-5xl font-bold "
                    onClick={closeModal}
                  >
                    &times;
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
