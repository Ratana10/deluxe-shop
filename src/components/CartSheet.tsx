// /components/CartSheet.tsx
"use client"; // This ensures it's a client component

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Using shadcn's sheet component
import { ShoppingCartIcon } from "@heroicons/react/24/outline"; // Optional: Icon from Heroicons
import Image from "next/image";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";


const CartSheet = () => {
  const [isOpen, setIsOpen] = useState(false); // Control the sheet visibility

  return (
    <>
      {/* Cart Icon Button (Trigger) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            onClick={() => setIsOpen(true)}
            className="relative inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {/* Badge for cart item count */}
            <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
              3 {/* Hardcoded for now */}
            </span>
          </button>
        </SheetTrigger>

        {/* Sheet for Cart */}
        <SheetContent side="right" className=" p-6 bg-white shadow-lg">
          <div>
            {/* Cart Header */}
            <SheetHeader>
              <SheetTitle className="text-start border-b pb-4 mb-4">
                Your Cart
              </SheetTitle>
            </SheetHeader>

            {/* Cart Items */}
            <div className="space-y-4">
              {/* Cart item design */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="relative w-16 h-12">
                    <Image
                      src="/img/jewelry.jpeg" // Replace with actual product image
                      alt="Product name"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-semibold sm:text-sm">
                      Product Name
                    </h3>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600 text-sm sm:text-xs">$100</p>
                      <p className="text-gray-600 text-sm sm:text-xs"> x 1</p>
                    </div>
                  </div>
                </div>
                <button className="btn-danger" >
                  <Trash className="h-4 w-4" />
                </button>
              </div>

              {/* Repeat similar items */}
            </div>

            {/* Total Price & Actions */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>$300</span> {/* Total price placeholder */}
              </div>
            </div>

            <button className="btn-primary w-full mt-3">Checkout</button>
            <Button className=" w-full mt-3 btn-secondary">Clear Cart</Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartSheet;
