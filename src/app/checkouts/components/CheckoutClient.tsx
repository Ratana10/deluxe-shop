"use client";

import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Map from "@/components/Map";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/app/context/CartContext";
import toast from "react-hot-toast";
import { useTelegram } from "@/app/hooks/useTelegram";
import { useRouter } from "next/navigation";
import { IOrder } from "@/types";
import { IOrderStatus, IPaymentStatus, PaymentMethod } from "@/types/enums";

const CheckoutClient = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState<string>("null");
  const [location, setLocation] = useState<string>("null");
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "order-summary",
  ]);
  const [paymentMethod, setPaymentMethod] = useState<string>("delivery");
  const [isAgreed, setIsAgreed] = useState(false);

  const { cart, clearCart, totalAmount, subtotalAmount, DELIVERY_FEE } =
    useCart();
  const { tg, queryId, chatId, showBackButton, hideBackButton } = useTelegram(); // Use your useTelegram hook

  const onMainButtonClick = useCallback(() => {
    console.log("Main button clicked");

    const orderDetails = cart.map((item) => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
    
    const order: IOrder = {
      chatId,
      queryId,
      orderStatus: IOrderStatus.PENDING,
      paymentStatus: IPaymentStatus.PENDING,
      paymentMethod:
        paymentMethod === "delivery"
          ? PaymentMethod.DELIVERY
          : PaymentMethod.BANK,
      deliveryFee: DELIVERY_FEE,
      subtotal: subtotalAmount,
      total: totalAmount,
      phoneNumber,
      location,
      address,
      orderDetails
    };

    toast.promise(
      fetch("/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }).then(async (res) => {
        if (res.ok) {
          clearCart(); // Clear cart on success
        } else {
          throw new Error("Order failed");
        }
      }),
      {
        loading: "Loading ...",
        success: "Order Placed successfully",
        error: "Order failed! Please try again.",
      }
    );
  }, [
    phoneNumber,
    address,
    totalAmount,
    chatId,
    queryId,
    cart,
    clearCart,
    totalAmount,
    subtotalAmount,
    DELIVERY_FEE,
    paymentMethod,
    isAgreed,
    location,
  ]);

  useEffect(() => {
    if (tg) {
      showBackButton();
      tg.BackButton.onClick(() => {
        router.back();
      });
    }

    return () => {
      tg?.BackButton.hide();
    };
  }, [tg, router, showBackButton, hideBackButton, isAgreed]);

  useEffect(() => {
    if (tg && phoneNumber && isAgreed) {
      console.log("Main button show");

      // Show tg main button
      tg.MainButton.setText("Place Order");
      tg.MainButton.show();
      tg.MainButton.onClick(onMainButtonClick);

      // Cleanup the effect when component unmounts
      return () => {
        tg.MainButton.hide();
        tg.MainButton.offClick(onMainButtonClick);
      };
    }
  }, [tg, phoneNumber, onMainButtonClick, isAgreed]);

  // Handle location selection from the map
  const handleLocationSelect = (address: string, locationLink: string) => {
    setAddress(address);
    setLocation(locationLink);
  };

  // Handle accordion item expansion
  const handleAccordionChange = (value: string[]) => {
    const newItems = Array.from(new Set([...expandedItems, ...value]));
    setExpandedItems(newItems);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleAgreeChange = () => {
    setIsAgreed(!isAgreed); // Toggle agreement state
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center my-4">Checkout</h1>
      <div className="space-y-4">
        {/* Phone Input */}
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            type="tel"
            id="phone"
            placeholder="Enter your phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Accordion for Map and QR Code */}
        <Accordion
          type="multiple"
          value={expandedItems}
          onValueChange={handleAccordionChange}
          className="mt-4"
        >
          {/* Accordion Item for Map */}
          <AccordionItem value="location">
            <AccordionTrigger>Delivery Address</AccordionTrigger>
            <AccordionContent>
              <div className="mt-2">
                <Map onLocationSelect={handleLocationSelect} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion Item for Payment Method */}
          <AccordionItem value="payment-method">
            <AccordionTrigger>Payment Method</AccordionTrigger>
            <AccordionContent>
              <div className="mt-2">
                <div className="flex space-x-4 mt-4">
                  {/* Cash on Delivery Payment Option */}
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="delivery"
                      name="paymentMethod"
                      value="delivery"
                      checked={paymentMethod === "delivery"}
                      onChange={() => handlePaymentMethodChange("delivery")}
                    />
                    <Label htmlFor="delivery" className="ml-2">
                      Cash on Delivery
                    </Label>
                  </div>

                  {/* QR Code Payment Option */}
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="qr"
                      name="paymentMethod"
                      value="qr"
                      checked={paymentMethod === "qr"}
                      onChange={() => handlePaymentMethodChange("qr")}
                    />
                    <Label htmlFor="qr" className="ml-2">
                      Pay via QR Code
                    </Label>
                  </div>
                </div>
                {/* Conditionally Render Payment QR Code (Directly without AccordionItem) */}
                {paymentMethod === "qr" && (
                  <div className="mt-4">
                    <p className="text-sm mb-4 text-gray-600">
                      Here&apos;s our ABA QR
                    </p>

                    {/* QR Image */}
                    <div className="flex justify-center mb-4">
                      <Image
                        src="/img/aba_qr.jpg" // Replace with your actual QR code image path
                        alt="QR Code"
                        width={256}
                        height={256}
                        className="block"
                      />
                    </div>

                    {/* Account Detail */}
                    <h3 className="font-bold text-lg md:text-xl text-center">
                      Total ${totalAmount.toFixed(2)}
                    </h3>
                    <div className="mt-4 space-y-2 text-gray-600">
                      <p className="text-sm ">
                        Account Name:
                        <span className="font-bold text-customRedBrown">
                          SARANN CHAN MINEA
                        </span>
                      </p>
                      <p className="text-sm">
                        Account Number:
                        <span className="font-bold text-customRedBrown">
                          1234567890
                        </span>
                      </p>
                      <p className="text-sm">
                        Account Link:
                        <a
                          href="https://pay.ababank.com/JC5nCa15DCHG4TXM8"
                          className="text-blue-500 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ABA payment link
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion Item for Order Summary */}
          <AccordionItem value="order-summary">
            <AccordionTrigger>Order Summary</AccordionTrigger>
            <AccordionContent>
              <div className="mt-2">
                <ul>
                  {cart.map((item) => (
                    <li key={item.id} className="flex justify-between mb-4">
                      <span>
                        {item.name} {"  "} x {item.quantity}
                      </span>
                      <span>${item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t my-4" />
                <div className="flex justify-between mb-4">
                  <p>Subtotal</p>
                  <span>$ {subtotalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <p>Delivery</p>
                  <span>$ {DELIVERY_FEE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <p>Total</p>
                  <span>$ {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Checkbox for payment confirmation */}
          <div className="flex items-center mt-4">
            <Checkbox
              id="agree"
              checked={isAgreed}
              onCheckedChange={handleAgreeChange}
            />
            <Label
              htmlFor="agree"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
            >
              I agree
            </Label>
          </div>
        </Accordion>
      </div>
    </div>
  );
};

export default CheckoutClient;
