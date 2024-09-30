"use client";

import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Markazi_Text } from "next/font/google";
import { useRef, useState } from "react";

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
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  const locationButtonAdded = useRef(false);

  // laod script for google map
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return <div>Loading....</div>;

  const mapOptions = {
    zoomControl: true, // Optional: Add or remove control features as needed
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    gestureHandling: "greedy", // This setting enables one-finger dragging on mobile
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

  // Function to perform reverse geocoding
  const fetchAddress = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };
    try {
      const result = await geocoder.geocode({ location: latlng });
      if (result.results[0]) {
        const addressComponents = result.results[0].address_components;

        // Extract specific address components
        const houseNumber = addressComponents.find((comp) =>
          comp.types.includes("street_number")
        )?.long_name;
        const street = addressComponents.find((comp) =>
          comp.types.includes("route")
        )?.long_name;
        const sangkat = addressComponents.find((comp) =>
          comp.types.includes("sublocality")
        )?.long_name;
        const khan = addressComponents.find((comp) =>
          comp.types.includes("administrative_area_level_2")
        )?.long_name;
        const cityOrProvince = addressComponents.find((comp) =>
          comp.types.includes("administrative_area_level_1")
        )?.long_name;
        const country = addressComponents.find((comp) =>
          comp.types.includes("country")
        )?.long_name;

        // Build the Cambodian address format
        const cambodianAddress = `${houseNumber || ""} ${
          street || ""
        }, Sangkat ${sangkat || ""}, Khan ${khan || ""}, ${
          cityOrProvince || ""
        }, ${country || ""}`;

        return cambodianAddress.trim(); // Return the formatted address
      } else {
        console.error("No address found for the selected location");
        return null;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };


  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const location = { lat, lng };
      setSelectedLocation(location);
      setCurrentLocation(location);

      const address = await fetchAddress(lat, lng);
      if (address) {
        onLocationSelect(address);
      }
    }
  };

  // Handle getting the user's current location
  const handleGetLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };

          const address = await fetchAddress(latitude, longitude); // Fetch address for user's current location
          if (address) {
            onLocationSelect(address); // Only pass the address to parent
          }

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

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentLocation || center}
      zoom={15}
      options={mapOptions}
      onClick={handleMapClick}
      onLoad={onMapLoad}
    >
      {/* Add a marker at the selected location */}
      {selectedLocation && <Marker position={selectedLocation} />}
      {currentLocation && <Marker position={currentLocation} />}
    </GoogleMap>
  );
};

export default Map;
