import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from 'expo-router';
import { useEffect } from "react";


export default function Index() {

  // 🔥 TEST SUPABASE

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* LOGO */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoEmoji}>🚗</Text>
      </View>

      {/* TITRE */}
      <Text style={styles.title}>Livraison Express CM</Text>
      <Text style={styles.subtitle}>
        Livraison rapide par moto à Yaoundé & Douala
      </Text>

      {/* BOUTONS */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.btnPrimary}>
          <Link href="/inscription">
            <Text style={styles.btnPrimaryText}>Commencer →</Text>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnOutline}>
          <Text style={styles.btnOutlineText}> <Link href="/connexion"><Text style={styles.link}> {"j'ai déjà un compte"}</Text> </Link></Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <Text style={styles.footer}>🇨🇲 Made in Cameroun</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A56DB",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoEmoji: {
    fontSize: 52,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 48,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: "#F5A623",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  btnPrimaryText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
  },
  btnOutline: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  btnOutlineText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },
  link: {
    color: "#FFFFFF", // ou la couleur de votre choix
    fontWeight: "600",
  },

});

