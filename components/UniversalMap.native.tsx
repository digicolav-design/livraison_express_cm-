import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

interface UniversalMapProps {
  pickup_address: {
    latitude: number;
    longitude: number;
  };
  delivery_address: {
    latitude: number;
    longitude: number;
  };
}
export default function UniversalMap({
  pickup_address,
  delivery_address,
}: UniversalMapProps) {
  const midLat = (pickup_address.latitude + delivery_address.latitude) / 2;

  const midLng = (pickup_address.longitude + delivery_address.longitude) / 2;

  /*─── Cas Web (Leaflet + OpenStreetMap) ───────────────────────────────
  if (Platform.OS === "web") {
    // ⚠️ Import dynamique → évite "window is not defined" côté mobile
    const { MapContainer, TileLayer, Marker, Polyline } = require("react-leaflet");
    require("leaflet/dist/leaflet.css");*/

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={{
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {/* Marqueurs départ et destination */}
      <Marker coordinate={pickup_address} />
      <Marker coordinate={delivery_address} />

      {/* Ligne entre départ et destination */}
      <Polyline
        coordinates={[pickup_address, delivery_address]}
        strokeColor="#4285F4"
        strokeWidth={3}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1, ...StyleSheet.absoluteFillObject },
});
