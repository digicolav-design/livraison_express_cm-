import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Animated, ScrollView } from 'react-native';
import { router, useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

interface Course {
  id: number;
  image: string;
  pickup_address: string;
  delivery_address: string;
  date: Date;
  distance: number;
  duree: number;
  gain: number;
}

export default function DashboardCoursier() {
  const [online, setOnline] = useState(true);
  const [solde, setSolde] = useState(0);
  const [stats, setStats] = useState({ courses: 0, gains: 0, note: 0 });
  const [courses, setCourses] = useState<Course[]>([]);

  // 🔹 Animation pour le point clignotant
  const blinkAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.2, duration: 500, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: profil } = await supabase.from('coursiers').select('solde').single();
      setSolde(profil?.solde || 0);

      const { data: statistiques } = await supabase
        .from('coursiers')
        .select('courses,gains,note')
        .single();
      setStats({
        courses: statistiques?.courses || 0,
        gains: statistiques?.gains || 0,
        note: statistiques?.note || 0,
      });

      const { data: lastCourses } = await supabase
        .from('courses')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);
      setCourses(lastCourses || []);
    };
    fetchData();
  }, []);

  return (
    <>
    <ScrollView style={styles.container}>
      {/* 🔹 En-tête */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.statusBtn, { backgroundColor: online ? '#414143' : '#C0392B' }]}
            onPress={() => setOnline(!online)}
          >
            <View style={styles.statusRow}>
              <Animated.View
                style={[
                  styles.blinkDot,
                  { backgroundColor: online ? '#27AE60' : '#C0392B', opacity: blinkAnim }
                ]}
              />
              <Text style={styles.statusText}>{online ? 'En ligne' : 'Déconnecté'}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.name}> Jean-Baptiste K. ✋</Text>
        </View>


        {/* 🔹 Solde */}
      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Mon Solde</Text>
        <Text style={styles.balanceText}>{solde} FCFA</Text>
        <TouchableOpacity style={styles.retraitBtn}>
          <Text style={styles.retraitText}>💵 Retrait MoMo</Text>
        </TouchableOpacity>
      </View>

     

      </View>

       {/* 🔹 Statistiques */}
      <View style={styles.statsBox}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.courses}</Text>
          <Text style={styles.statLabel}>🚚 Courses</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.gains} FCFA</Text>
          <Text style={styles.statLabel}>💰 Gains</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.note.toFixed(1)}</Text>
          <Text style={styles.statLabel}>⭐ Note moy.</Text>
        </View>
      </View>
      {/* 🔹 Dernières courses */}
      <Text style={styles.sectionTitle}>📦 Dernières courses</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <Image source={{ uri: item.image }} style={styles.courseImage} />
            <View>
              <Text>{item.pickup_address} → {item.delivery_address}</Text>
              <Text>{item.date.toLocaleDateString()} - {item.distance} km - {item.duree} min</Text>
              <Text style={styles.gain}>+{item.gain} FCFA</Text>
            </View>
          </View>
        )}
      />

    </ScrollView>

    
    {/* Navigation bas */}
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => router.push("/#")}><Text>🏠 Accueil</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/#")}><Text>🗺️ Carte</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/#")}><Text>💰 Gains</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/profil_coursier")}><Text>👤 Profil</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/#")}><Text>🚪 Déconnexion</Text></TouchableOpacity>
        </View>
    </>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {backgroundColor:'#0a0a31',flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' },
  headerLeft: { flexDirection: 'column', alignItems: 'flex-start' },
  name: { fontSize: 28, fontWeight: 'bold', marginTop: 25, color:'#fff' },
  statusBtn: { borderBottomWidth:1, padding: 6, borderRadius: 20, marginTop: 20, marginLeft:6},
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  blinkDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  statusText: { color: '#327749', fontWeight: 'bold' },
  balanceBox: { justifyContent:'center',backgroundColor:'#0d0d3b', marginVertical: 16, marginTop :120, borderWidth: 1, borderColor: '#ccc', padding: 50, paddingRight:70, paddingLeft:70, borderRadius: 20 },
  balanceLabel: { fontSize: 15, fontWeight: 'bold', color: '#68666e' },
  balanceText: { fontSize: 70, fontWeight: 'bold', color: '#e39323', marginTop: 4 },
  retraitBtn: { marginTop: 8, backgroundColor: '#e39323', padding: 10, borderRadius: 15 },
  retraitText: { color: '#060606', fontWeight: 'bold', fontSize:20 },
  statsBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 12,
  },
  statItem: { alignItems: 'center', backgroundColor: '#f3efef', padding:40, borderWidth:1, borderColor:'#e39323',borderRadius:20 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#e39323' },
  statLabel: { fontSize: 14, color: '#070808' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 8 },
  courseItem: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  courseImage: { width: 50, height: 50, marginRight: 10, borderRadius: 8 },
  gain: { color: '#27AE60', fontWeight: 'bold' },
  navbar: { flexDirection: 'row', justifyContent: 'space-around', padding: 12, borderTopWidth: 1, borderColor: '#ccc' }
});
