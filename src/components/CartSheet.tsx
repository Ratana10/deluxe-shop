"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { CartItem } from "@/types";
import { toast } from "react-hot-toast";

const CartSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalQuantity, cart, clearCart, increaseQuantity, decreaseQuantity } =
    useCart();

  const totalPrice = cart.reduce(
    (total: number, item: CartItem) => total + item.price * item.quantity,
    0
  );

  const onOrder = async () => {
    const chatId = localStorage.getItem("chatId");

    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    toast.promise(
      fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart, chatId }),
      }).then(async (res) => {
        if (res.ok) {
          clearCart(); //Clear cart on success
        } else {
          throw new Error("Order fail");
        }
      }),
      {
        loading: "Loading ...",
        success: "Order Placed successfully",
        error: "Order failed! Please try again.",
      }
    );
  };

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
          className="w-[375px] sm:w-[540px] p-6 bg-white shadow-lg"
        >
          <div>
            {/* Cart Header */}
            <SheetHeader>
              <SheetTitle className="text-start border-b pb-4 mb-4">
                Your Cart
              </SheetTitle>
            </SheetHeader>
            {/* If cart is empty */}
            {cart.length === 0 ? (
              <p className="text-center">Your cart is empty</p>
            ) : (
              <ul className="space-y-4">
                {/* Cart item design */}
                {cart.map((item: CartItem, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="relative w-16 h-12">
                        <Image
                          src={item.image} // Replace with actual product image
                          alt={item.name}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base font-semibold sm:text-sm">
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

            {/* Total Price & Actions */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>{" "}
              </div>
            </div>

            <button className="btn-primary w-full mt-3" onClick={onOrder}>
              Place Order
            </button>
            <button className=" w-full mt-3 btn-secondary" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CartSheet;
