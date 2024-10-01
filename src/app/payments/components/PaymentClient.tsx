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

const PaymentClient = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState<string>("default");
  const [isPaid, setIsPaid] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([""]); // State to track expanded items (string[])

  const { cart, clearCart, totalAmount } = useCart();
  const { tg, queryId, user, onClose, onToggleButton } = useTelegram(); // Use your useTelegram hook

  // Memoize the onMainButtonClick function using useCallback
  const onMainButtonClick = useCallback(() => {
    console.log("Main button clicked");

    const orderDetails = cart.map((item) => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = {
      phoneNumber,
      address,
      isPaid,
      total: totalAmount,
      queryId,
      orderDetails,
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
        success:
          "Order Placed successfully\nPlease check your telegram notification",
        error: "Order failed! Please try again.",
      }
    );

    console.table(order);
  }, [phoneNumber, address, isPaid, totalAmount, cart, clearCart, queryId]);

  useEffect(() => {
    if (tg && phoneNumber && isPaid) {
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
  }, [tg, phoneNumber, isPaid, onMainButtonClick]);

  // Handle location selection from the map
  const handleLocationSelect = (address: string) => {
    console.log("address", address);
    setAddress(address);
  };

  const handleCheckboxChange = () => {
    setIsPaid(!isPaid);
  };

  // Handle accordion item expansion
  const handleAccordionChange = (value: string[]) => {
    const newItems = Array.from(new Set([...expandedItems, ...value]));
    setExpandedItems(newItems);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center my-4">Information</h1>
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
            <AccordionTrigger>Select Your Delivery Location</AccordionTrigger>
            <AccordionContent>
              <div className="mt-2">
                <Map onLocationSelect={handleLocationSelect} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Accordion Item for QR Code and Checkbox */}
          <AccordionItem value="qr-code">
            <AccordionTrigger>Payment QR Code</AccordionTrigger>
            <AccordionContent>
              <div className="mt-1">
                <p className="text-sm mb-4 text-gray-600">
                  Scan the QR Code to Pay:
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

                {/* Checkbox for payment confirmation */}
                <div className="flex items-center mt-4">
                  <Checkbox
                    id="paid"
                    checked={isPaid}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label
                    htmlFor="paid"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
                  >
                    I have already paid
                  </Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default PaymentClient;
