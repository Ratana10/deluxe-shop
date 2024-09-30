"use client";

import { useState } from "react";
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

const PaymentClient = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState<string>("");
  const [isPaid, setIsPaid] = useState(false);

  const { cart } =useCart();

  // Handle location selection from the map
  const handleLocationSelect = (address: string) => {
    console.log("address", address);
    setAddress(address);
  };

  const handleCheckboxChange = () => {
    setIsPaid(!isPaid);
  };

  const handleSubmit = () => {
    // Validate that phone number and address are filled and user confirmed payment
    if (!phoneNumber) {
      alert("Please enter your phone number");
      return;
    }

    if (!address) {
      alert("Please select your delivery location");
      return;
    }

    if (!isPaid) {
      alert("Please confirm that you have already paid");
      return;
    }

    // Here you can send the data to your server or process the order
    const orderData = {
      phoneNumber,
      address,
      isPaid,
    };

    console.log("Processing order with the following data:", orderData);
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
        <Accordion type="single" collapsible className="mt-4">
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
