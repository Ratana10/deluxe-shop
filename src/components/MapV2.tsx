import {
  GoogleMap,
  useJsApiLoader,
  useLoadScript,
} from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "350px",
  margin: "auto",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

interface Props {
  onLocationSelect: (address: string) => void;
}
const MapV1 = ({ onLocationSelect }: Props) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // laod script for google map
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return <div>Loading....</div>;

  // static lat and lng
  const center = {
    lat: -3.745,
    lng: -38.523,
  };

  return (
    <GoogleMap
      zoom={15}
      center={currentLocation || center}
      mapContainerClassName="map"
      mapContainerStyle={containerStyle}
    ></GoogleMap>
  );
};

export default MapV1;
