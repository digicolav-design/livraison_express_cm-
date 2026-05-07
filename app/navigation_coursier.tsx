import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Linking,
  Alert,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import UniversalMap from "./UniversalMap";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function NavigationGPSCoursier() {
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();
  const router = useRouter(); //  navigation Expo Router

  //  Données mock (à remplacer par API / DB)
  const courseData = {
    id: courseId || "course_001",
    pickup_address: { label: "Rue Melen, Yaoundé", latitude: 3.8634, longitude: 11.5167 },
    delivery_address: { label: "Bastos, Yaoundé", latitude: 3.8800, longitude: 11.5050 },
    client: { name: "Paul Mbarga", phone: "+237690000000", photoUrl: null },
  };

  //  États dynamiques
  const [distance, setDistance] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number>(0);
  const [estimatedArrival, setEstimatedArrival] = useState<string>("");

  //  Point vert clignotant
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  // Fonction utilitaire Alert (fallback Web)
  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n${message}`);
      if (onConfirm) onConfirm();
    } else {
      Alert.alert(title, message, [{ text: "OK", onPress: onConfirm }]);
    }
  };

  // Calcul distance & durée en temps réel
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showAlert("Permission refusée", "Impossible d'accéder à la localisation.");
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;

      // Calcul distance simple (Haversine)
      const R = 6371;
      const dLat = (courseData.pickup_address.latitude - latitude) * Math.PI / 180;
      const dLng = (courseData.pickup_address.longitude - longitude) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(latitude * Math.PI / 180) *
          Math.cos(courseData.pickup_address.latitude * Math.PI / 180) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = R * c;

      setDistance(Number(dist.toFixed(1)));

      const minutes = Math.round((dist / 12) * 60); // vitesse moyenne moto
      setDurationMinutes(minutes);

      const now = new Date();
      now.setMinutes(now.getMinutes() + minutes);
      setEstimatedArrival(`${now.getHours()}h${String(now.getMinutes()).padStart(2, "0")}`);
    })();
  }, []);

  // ✅ Action "J’ai récupéré le colis"
  const handlePickup = () => {
    showAlert(
      "Confirmation",
      "Cliquez sur OK pour confirmer la récupération de votre colis",
      () => {
        showAlert("Notification envoyée", "🚚 En route pour votre livraison", () => {
          router.push("/profil_coursier"); // ✅ navigation après alerte
        });
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Animated.View style={[styles.dot, { opacity }]} />
        <Text style={styles.headerText}>En route vers le client</Text>
        <Text style={styles.distanceText}>{distance} km restants</Text>
      </View>

      {/* ── Carte ── */}
      <View style={styles.mapContainer}>
        <UniversalMap pickup_address={courseData.pickup_address} delivery_address={courseData.delivery_address} />
      </View>

      {/* ── Infos temps ── */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Arrivée estimée : {estimatedArrival}</Text>
        <Text style={styles.infoText}>{durationMinutes} MIN</Text>
        <Text style={styles.infoText}>Destination : {courseData.delivery_address.label}</Text>
      </View>

      {/* ── Prochaine direction ── */}
      <View style={styles.directionCard}>
        <Text style={styles.directionText}>
          ➡️ Tourner à gauche sur Avenue Kennedy – dans {distance} km
        </Text>
      </View>

      {/* ── Infos client ── */}
      <View style={styles.clientCard}>
        {courseData.client.photoUrl ? (
          <Image source={{ uri: courseData.client.photoUrl }} style={styles.clientPhoto} />
        ) : (
          <Text style={styles.clientPhoto}>👤</Text>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.clientName}>{courseData.client.name} (Client)</Text>
          <Text style={styles.clientAddress}>{courseData.pickup_address.label}</Text>
        </View>
        <TouchableOpacity onPress={() => Linking.openURL(`sms:${courseData.client.phone}`)}>
          <Text style={styles.msgButton}>📩</Text>
        </TouchableOpacity>
      </View>

      {/* ── Bouton action ── */}
      <TouchableOpacity style={styles.btnPickup} onPress={handlePickup}>
        <Text style={styles.btnPickupText}>✅ J’ai récupéré le colis</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8EEF7", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#00C853", marginRight: 8 },
  headerText: { fontSize: 16, fontWeight: "700", flex: 1 },
  distanceText: { fontSize: 14, color: "#4285F4", fontWeight: "600" },
  mapContainer: { height: 250, borderRadius: 12, overflow: "hidden", marginBottom: 16 },
  infoCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 12 },
  infoText: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  directionCard: { backgroundColor: "#FFFBF0", borderRadius: 12, padding: 12, marginBottom: 12 },
  directionText: { fontSize: 14, fontWeight: "700", color: "#FF3B30" },
  clientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  clientPhoto: { fontSize: 32, marginRight: 12 },
  clientName: { fontSize: 15, fontWeight: "700" },
  clientAddress: { fontSize: 13, color: "#555" },
  msgButton: { fontSize: 24, marginLeft: 8 },
  btnPickup: { backgroundColor: "#00C853", borderRadius: 12, padding: 14, alignItems: "center" },
  btnPickupText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
