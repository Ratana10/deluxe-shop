"use client";

import { LatLngLiteral } from "leaflet";
import { useState } from "react";
import dynamic from "next/dynamic";

const MapSelector = dynamic(() => import("@/components/MapSelector"), {
  ssr: false,
});

const PaymentClient = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState<LatLngLiteral | null>(null);

  const handleLocationSelect = (selectedLocation: LatLngLiteral) => {
    setLocation(selectedLocation);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center my-4">
        Payment Information
      </h1>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phone"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        {/* MapSelector Component */}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Your Location
          </label>
          <div className="mt-2">
            <MapSelector onLocationSelect={handleLocationSelect} />
          </div>
        </div>

        {/* Show selected location */}
        {location && (
          <div className="mt-4">
            <p className="text-sm font-medium">Selected Location:</p>
            <p>Latitude: {location.lat}</p>
            <p>Longitude: {location.lng}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentClient;
