import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { supabase } from "../../lib/supabase";
import { router } from "expo-router";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// ✅ Type pour une livraison
export type deliveries = {
  id: string;
  date: string;
  gain: number;
  rating: number;
  duration: number;
  distance: number;
};

export default function MesGains() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [stats, setStats] = useState<{
    total: number;
    courses: number;
    avgRating: number;
    hoursOnline: string;
    chartData: { labels: string[]; datasets: { data: number[]; colors: (() => string)[] }[] };
    nextWithdrawal: string;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let query = supabase.from("deliveries").select("*");

        if (period === "day") query = query.eq("date", new Date().toISOString().slice(0, 10));
        if (period === "week") query = query.gte("date", getMonday());
        if (period === "month") query = query.gte("date", getFirstDayOfMonth());

        const { data, error } = await query;

        if (error) {
          console.warn("Erreur Supabase, utilisation des données fictives:", error.message);
          return useFakeData();
        }

        const courses: deliveries[] = data || [];
        computeStats(courses);
      } catch (err) {
        console.error("Erreur inattendue:", err);
        useFakeData();
      }
    };

    const useFakeData = () => {
      const fakeCourses: deliveries[] = [
        { id: "1", date: "2026-05-13", gain: 2000, rating: 4.5, duration: 30, distance: 5 },
        { id: "2", date: "2026-05-13", gain: 3500, rating: 5, duration: 45, distance: 8 },
        { id: "3", date: "2026-05-15", gain: 1500, rating: 4, duration: 20, distance: 3 },
        { id: "4", date: "2026-05-14", gain: 5000, rating: 4.8, duration: 60, distance: 10 },
      ];
      computeStats(fakeCourses);
    };

    const computeStats = (courses: deliveries[]) => {
      const total = courses.reduce((sum, c) => sum + c.gain, 0);
      const avgRating =
        courses.length > 0
          ? courses.reduce((sum, c) => sum + c.rating, 0) / courses.length
          : 0;
      const hoursOnline = calcHoursOnline(courses);

      setStats({
        total,
        courses: courses.length,
        avgRating,
        hoursOnline,
        chartData: buildChart(period, courses),
        nextWithdrawal: getNextThursday(),
      });
    };

    fetchStats();
  }, [period]);

  if (!stats) return <Text>Chargement...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/Coursier/dashboard_coursier")} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>MES GAINS</Text>
        <View style={styles.tabs}>
          {["day", "week", "month"].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.tab, period === p && styles.tabActive]}
              onPress={() => setPeriod(p as "day" | "week" | "month")}
            >
              <Text style={[styles.tabText, period === p && styles.tabTextActive]}>
                {p === "day" ? "Aujourd'hui" : p === "week" ? "Semaine" : "Mois"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView>
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Total Gagné</Text>
          <Text style={styles.summaryGain}>{stats.total} FCFA</Text>
          <View style={styles.summaryDetails}>
            <Text style={styles.summaryText}>Courses : {stats.courses}</Text>
            <Text style={styles.summaryText}>En ligne : {stats.hoursOnline}</Text>
            <Text style={styles.summaryText}>Note moy : {stats.avgRating.toFixed(1)}</Text>
          </View>
        </View>

       
        <View style={styles.Diagramme}>

          <BarChart 
            style={styles.Diagrammef}
            data={stats.chartData}
            width={screenWidth * 0.8}
           height={220}
           yAxisLabel=""
            yAxisSuffix="F"
           chartConfig={{
             backgroundColor: "#fff",
             backgroundGradientFrom: "#fff",
             backgroundGradientTo: "#fff",
             color: () => "rgb(88, 90, 92)",
             propsForBackgroundLines: {
              strokeWidth: 0,  
              },
              barPercentage: 0.5,
           }}
           fromZero
            showBarTops={true}
           withCustomBarColorFromData={true}
            flatColor={true}
           showValuesOnTopOfBars={true}
             
          />
       </View>
        
        <View style={styles.retrait}>
          <Text style={styles.retraitText}>Retrait disponible : {stats.total} FCFA</Text>
          <Text style={styles.retraitText}>Prochain retrait : {stats.nextWithdrawal}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------ Helpers ------------------ */

function getMonday(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().slice(0, 10);
}

function getFirstDayOfMonth(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function calcHoursOnline(courses: deliveries[]): string {
  return "4h30"; // valeur fictive
}

// Calcul du prochain jeudi
function getNextThursday(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = (4 - day + 7) % 7; // jeudi = 4
  d.setDate(d.getDate() + diff);
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

function buildChart(period: string, courses: deliveries[]) {
  let labels: string[] = [];
  let data: number[] = [];

  if (period === "day") {
    labels = ["8h", "9h", "10h", "11h", "12h", "13h", "14h"];
    data = [2000, 3000, 5000, 8000, 4000, 2000, 1000];
  } else if (period === "week") {
    labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    data = [5000, 7000, 8000, 6000, 4000, 3000, 2000];
  } else {
    labels = ["S1", "S2", "S3", "S4"];
    data = [15000, 20000, 18000, 22000];
  }

  const maxValue = Math.max(...data);

  return {
    labels,
    datasets: [
      {
        data,
        colors: data.map((value) =>
          () => (value === maxValue ? "orange" : "rgba(66, 133, 244, 1)")
        ),
      },
    ],
  };
}


/* ------------------ Styles ------------------ */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor:  "#fff", padding: 20, margin:20},
  header: {marginBottom: 20, backgroundColor: "#141428", padding: 10, borderRadius: 10 },
  backButton: { marginBottom: 10, borderRadius: 10, padding: 10, borderWidth: 1, backgroundColor: "#414242", alignSelf: "flex-start" },
  backText: { fontSize: 16, color: "#4285F4" },
  title: { fontSize: 30, fontWeight: "bold", textAlign: "center", marginBottom: 20 , color: "#fff" },
  tabs: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  tab: { padding: 10, borderRadius: 10, backgroundColor: "#414242" },
  tabActive: { backgroundColor: "orange" },
  tabText: { color: "#fff", fontWeight: "bold" },
  tabTextActive: { color: "#000" },
  summary: { backgroundColor: "#0f0f0f", padding: 15, borderRadius: 10, borderColor: "orange", borderWidth: 1 },
  summaryTitle: { fontSize: 25, color: "#414242", marginBottom: 5 },
  summaryGain: { fontSize: 40, fontWeight: "bold", color: "orange" },
  summaryDetails: { marginTop: 10, flexDirection: "row", justifyContent: "space-between", },
  summaryText: { fontSize: 20, marginBottom: 5, color: "#fff", padding:10  },
  Diagramme:{marginLeft:100, marginRight:20, marginVertical: 10 },
  Diagrammef:{alignItems: "center", justifyContent: "center" },
  retrait: { backgroundColor: "#eee", padding: 15, borderRadius: 10, marginTop: 20 },
  retraitText: { fontSize: 16, marginBottom: 5 },
});
