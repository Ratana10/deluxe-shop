"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useRef, useState } from "react";

const containerStyle = { width: "100%", height: "400px", margin: "auto" };
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

  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const locationButtonAdded = useRef(false);

  // Handle getting the user's current location
  const handleGetLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };

          setSelectedLocation(null); // Clear selected location when getting current location
          setCurrentLocation({ lat: latitude, lng: longitude });


        // Set the map center and zoom in
        if (mapRef.current) {
          mapRef.current.setCenter(newLocation);
          mapRef.current.setZoom(15); // Adjust zoom level as needed, for example, to 15
        }
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const location = { lat, lng };
      setSelectedLocation(location);
      setCurrentLocation(null);
    }
  };

  // Add a custom control button to get current location
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (!locationButtonAdded.current) {
      const controlDiv = document.createElement("div");
      const controlUI = document.createElement("div");
      controlUI.innerHTML = "My location";
      controlUI.style.backgroundColor = "white";
      controlUI.style.color = "black";
      controlUI.style.border = "2px solid #ccc";
      controlUI.style.borderRadius = "3px";
      controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
      controlUI.style.cursor = "pointer";
      controlUI.style.marginBottom = "22px";
      controlUI.style.textAlign = "center";
      controlUI.style.padding = "8px 0";
      controlUI.addEventListener("click", handleGetLocationClick);
      controlDiv.appendChild(controlUI);

      // Add the control UI to the map
      map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(
        controlDiv
      );
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation || center}
        zoom={10}
        onClick={handleMapClick}
        onLoad={onMapLoad}
      >
        {/* Add a marker at the selected location */}
        {selectedLocation && <Marker position={selectedLocation} />}
        {currentLocation && <Marker position={currentLocation} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
