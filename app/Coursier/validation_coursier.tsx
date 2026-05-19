import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DossierEnCours() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const rawSubmissionDate = Array.isArray(params.submissionDate)
    ? params.submissionDate[0]
    : params.submissionDate;

  // Date exacte de soumission passée en paramètre
  const submissionDate =
    rawSubmissionDate != null ? new Date(rawSubmissionDate) : new Date();

  // Deadline = soumission + 72h
  const deadline = submissionDate.getTime() + 72 * 60 * 60 * 1000;

  const [timeLeft, setTimeLeft] = useState(deadline - Date.now());
  const [blink, setBlink] = useState(true);

  //  Statut du dossier (par défaut en attente)
  const [status, setStatus] = useState<"en_attente" | "validé">("en_attente");

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = deadline - Date.now();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        //Redirection vers la page d’accueil client si délai dépassé
        router.replace("//accueil-client");
      }
    }, 1000);

    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(blinkInterval);
    };
  }, []);

  const formatTime = (ms: number) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Bouton de retour */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>←</Text>
      </TouchableOpacity>

      {/* Icône clignotante */}
      <TouchableOpacity style={[styles.iconButton, blink && styles.blink]}>
        <Text style={styles.iconText}>⏳</Text>
      </TouchableOpacity>

      <Text style={styles.title}>DOSSIER EN COURS D’EXAMEN</Text>
      <Text style={styles.subtitle}>
        Notre équipe vérifie vos documents. Vous recevrez un SMS après validation.
      </Text>

      {/* Étapes */}
      <TouchableOpacity style={styles.section}>
        <Text style={styles.step}> Documents soumis</Text>
        <Text style={styles.date}>{new Date(submissionDate).toLocaleString()}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text style={styles.step}> Vérification en cours</Text>
        <Text style={styles.date}>Délai : 48–72h maximum</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text style={styles.step}>SMS de confirmation</Text>
        <Text style={styles.date}>Notification après validation</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text style={styles.step}>📞 Une question ? contactez‑nous au +237 682429054</Text>
      </TouchableOpacity>

      {/* Compte à rebours */}
      <Text style={styles.countdown}>Temps restant : {formatTime(timeLeft)}</Text>

      {/* Bouton vers dashboard (activé seulement si validé) */}
      <TouchableOpacity
        style={[styles.dashboardBtn, status === "en_attente" && styles.disabledBtn]}
        disabled={status === "en_attente"}
        onPress={() => router.push("/Coursier/dashboard_coursier")}
      >
        <Text style={styles.dashboardText}>
          {status === "en_attente" ? "⏳ En attente de validation" : "➡️ Accéder au Dashboard"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center", backgroundColor: "#050b25" },
  backBtn: {
    backgroundColor: "#222d45",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backBtnText: { color: "#f4efef", fontSize: 18, fontWeight: "bold" },
  iconButton: {
    backgroundColor: "#603c0a",
    borderWidth: 2,
    borderColor: "orange",
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    opacity: 0.7,
  },
  iconText: { fontSize: 50, color: "orange" },
  blink: { opacity: 1 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 5, color: "#f4efef" },
  subtitle: { fontSize: 14, color: "#f4efef", marginBottom: 20, textAlign: "center" },
  section: {
    backgroundColor: "#3f4250",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
    width: "100%",
  },
  step: { fontWeight: "bold", fontSize: 16, color: "#f7f3f3" },
  date: { fontSize: 14, color: "#c4c2c2" },
  countdown: { marginTop: 30, fontSize: 18, fontWeight: "bold", color: "red" },
  dashboardBtn: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "green",
    alignItems: "center",
    width: "100%",
  },
  disabledBtn: { backgroundColor: "#555" },
  dashboardText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
