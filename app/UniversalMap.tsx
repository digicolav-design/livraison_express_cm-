import React from "react";
import { Platform, Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");

interface UniversalMapProps {
  pickup_address: { latitude: number; longitude: number };
  delivery_address: { latitude: number; longitude: number };
}

const UniversalMap: React.FC<UniversalMapProps> = ({ pickup_address,  delivery_address }) => {
  // ✅ Calcul du centre de la carte
  const midLat = (pickup_address.latitude +  delivery_address.latitude) / 2;
  const midLng = (pickup_address.longitude +  delivery_address.longitude) / 2;

  // ─── Cas Web (Leaflet + OpenStreetMap) ───────────────────────────────
  if (Platform.OS === "web") {
    // ⚠️ Import dynamique → évite "window is not defined" côté mobile
    const { MapContainer, TileLayer, Marker, Polyline } = require("react-leaflet");
    require("leaflet/dist/leaflet.css");

    return (
      <MapContainer
        center={[midLat, midLng]}
        zoom={13}
        style={{ width: "100%", height: height * 0.28 }}
      >
        {/* Fond de carte OpenStreetMap */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Marqueurs départ et destination */}
        <Marker position={[pickup_address.latitude, pickup_address.longitude]} />
        <Marker position={[delivery_address.latitude, delivery_address.longitude]} />

        {/* Ligne entre départ et destination */}
        <Polyline
          positions={[
            [pickup_address.latitude, pickup_address.longitude],
            [delivery_address.latitude, delivery_address.longitude],
          ]}
          pathOptions={{ color: "#4285F4", weight: 3 }}
        />
      </MapContainer>
    );
  }

  // ─── Cas Mobile (React Native Maps) ───────────────────────────────
  const MapView = require("react-native-maps").default;
  const { Marker: RNMarker, Polyline: RNPolyline, PROVIDER_GOOGLE } = require("react-native-maps");

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
      <RNMarker coordinate={pickup_address} />
      <RNMarker coordinate={delivery_address} />

      {/* Ligne entre départ et destination */}
      <RNPolyline
        coordinates={[pickup_address, delivery_address]}
        strokeColor="#4285F4"
        strokeWidth={3}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default UniversalMap;
