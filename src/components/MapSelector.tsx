import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngLiteral } from "leaflet";
import "leaflet-control-geocoder";

interface MapSelectorProps {
  onLocationSelect: (location: LatLngLiteral, address: string) => void;
}

const GeolocationMarker: React.FC<{
  setLocation: (location: LatLngLiteral, address: string) => void;
  centerMap: (location: LatLngLiteral) => void;
}> = ({ setLocation, centerMap }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      reverseGeocode({ lat, lng }, setLocation);
      map.flyTo([lat, lng], map.getZoom());
    },
  });

  // Geolocation: Get current user location and center the map on that location
  useEffect(() => {
    map.locate().on("locationfound", (e) => {
      const { lat, lng } = e.latlng;
      reverseGeocode({ lat, lng }, setLocation);
      centerMap(e.latlng); // Center the map on the user's location
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map, setLocation, centerMap]);

  return null;
};

// Reverse geocoding: Convert coordinates to an address using OpenStreetMap's Nominatim service
const reverseGeocode = async (
  coords: LatLngLiteral,
  setLocation: (location: LatLngLiteral, address: string) => void
) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`
  );
  const data = await response.json();
  const address = data.display_name || "Unknown location";
  setLocation(coords, address);
};

const MapSelector: React.FC<MapSelectorProps> = ({ onLocationSelect }) => {
  const [location, setLocation] = useState<LatLngLiteral | null>(null);
  const [address, setAddress] = useState<string>("");
  const [mapCenter, setMapCenter] = useState<LatLngLiteral>({
    lat: 11.5564,
    lng: 104.9282,
  }); // Default center

  const handleLocationChange = (loc: LatLngLiteral, addr: string) => {
    setLocation(loc);
    setAddress(addr);
    onLocationSelect(loc, addr);
  };

  return (
    <div>
      <MapContainer
        center={mapCenter} // Use the updated center state
        zoom={20}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {location && <Marker position={location}></Marker>}
        <GeolocationMarker
          setLocation={handleLocationChange}
          centerMap={(loc) => setMapCenter(loc)} // Function to center the map
        />
      </MapContainer>
      {location && (
        <div className="mt-4">
          <p>
            <strong>Selected Location:</strong>
          </p>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
          <p>
            <strong>Address:</strong> {address}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapSelector;
