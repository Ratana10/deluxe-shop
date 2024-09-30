"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

interface Props {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

const Map = ({ onLocationSelect }: Props) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const location = { lat, lng };
      setSelectedLocation(location);

      onLocationSelect({ lat, lng });
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
      >
        {/* Add a marker at the selected location */}
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
