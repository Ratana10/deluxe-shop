"use client";

import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { CartItem } from "@/types";
import Link from "next/link";

const CartSheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    totalQuantity,
    totalAmount,
    subtotalAmount,
    cart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  return (
    <>
      {/* Cart Icon Button (Trigger) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            onClick={() => setIsOpen(true)}
            className="relative inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <ShoppingCart className="w-6 h-6" />
            {/* Badge for cart item count */}
            <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
              {totalQuantity}
            </span>
          </button>
        </SheetTrigger>

        {/* Sheet for Cart */}
        <SheetContent
          side="right"
          className="w-[85vw] sm:w-[520px] max-h-screen overflow-y-auto p-4 bg-white shadow-lg"
        >
          <div>
            {/* Cart Header */}
            <SheetHeader>
              <SheetTitle className="text-start">Your Cart</SheetTitle>
              <SheetDescription className="text-start border-b pb-4">
                You can view and manage items before placing an order
              </SheetDescription>
            </SheetHeader>
            {/* If cart is empty */}
            {cart.length === 0 ? (
              <p className="text-center my-4">Your cart is empty</p>
            ) : (
              <ul className="space-y-4 mt-4">
                {/* Cart item design */}
                {cart.map((item: CartItem, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="relative w-14 sm:w-16 h-10 sm:h-12">
                        <Image
                          src={item.image} // Replace with actual product image
                          alt={item.name}
                          fill
                          className="rounded-lg object-cover"
                          priority
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-semibold sm:text-base">
                          {item.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-600 text-sm sm:text-xs">
                            ${item.price.toFixed(2)}
                          </p>
                          <p className="text-gray-600 text-sm sm:text-xs">
                            x {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Increase and Decrease Buttons */}
                    <div className="flex items-center space-x-2">
                      {/* Decrease Button */}
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="text-white bg-red-500 px-2 py-1 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      {/* Increase Button */}
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="text-white bg-green-500 px-2 py-1 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </ul>
            )}

            {/* Total Price */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>${subtotalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <SheetFooter className="">
            <SheetClose asChild>
              <Link href="/checkouts">
                <button
                  className={`btn-primary w-full mt-3`}
                  disabled={cart.length === 0}
                >
                  Checkout
                </button>
              </Link>
            </SheetClose>
            <button className=" w-full mt-3 btn-secondary" onClick={clearCart}>
              Clear Cart
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartSheet;
