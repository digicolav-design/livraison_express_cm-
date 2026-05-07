import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function ProfilCoursier() {
  const router = useRouter();

  const coursier = {
    nom: "JEAN-BAPTISTE K.",
    ville: "Yaoundé",
    created_at: "Mars 2026",
    telephone: "+237 682429054",
    documents: [
      "Carte Nationale d'Identité",
      "Permis de conduire A",
      "Carte grise moto",
      "Assurance - Exp. Dec 2026",
    ],
    stats: { livraisons: 247, note: 4.9, completion: "98%" },
  };

  const [photo_uri, setPhoto_uri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setPhoto_uri(result.assets[0].uri);
  };

  return (
    <>
    <ScrollView contentContainerStyle={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImageFromGallery}>
          <Image
            source={{ uri: photo_uri || "https://via.placeholder.com/100" }}
            style={styles.avatar}
          />
          <Text style={styles.editPhoto}>📸 Modifier la photo</Text>
        </TouchableOpacity>
        <Text style={styles.name}>{coursier.nom}</Text>
        <Text style={styles.info}>
          Coursier depuis {coursier.created_at} - {coursier.ville}
        </Text>

        {/* Encadré statistiques */}
        <View style={styles.statsBox}> 
          <Text style={styles.statsItem}> {coursier.stats.livraisons} Livraisons</Text>
          <Text style={styles.statsItem}> {coursier.stats.note} Note moy.</Text>
          <Text style={styles.statsItem}> {coursier.stats.completion} Complétion</Text>
        </View>
      </View>

      {/* Mes documents */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>📂 Mes documents</Text>
        {coursier.documents.map((doc, i) => (
          <View key={i} style={styles.docBox}>
            <Text style={styles.docText}> {doc}      - Validé ✅  </Text>
          </View>
        ))}
      </View>

      {/* Mon compte */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>👤 Mon compte</Text>
        <TouchableOpacity style={styles.button}><Text >✏️ Modifier profil</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text >📞 {coursier.telephone}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button } onPress={() =>
            router.push({ pathname: "/notification_coursier", params: { id: "course_001" } })}>
              <Text >📧 Notifications
              </Text>
        </TouchableOpacity>
      </View>

      {/* Aide */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>❓ Aide</Text>
        <TouchableOpacity style={styles.button}><Text >🤖 Support LEC</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/#")}>
          <Text>📊 Mes statistiques</Text>
        </TouchableOpacity>
      </View>

      
    </ScrollView>

    
       {/* Navigation bas */}
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => router.push("/dashboard_coursier")}><Text>🏠 Accueil</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/#")}><Text>🗺️ Carte</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/#")}><Text>💰 Gains</Text></TouchableOpacity>
      <TouchableOpacity><Text>👤 Profil</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/#")}><Text>🚪 Déconnexion</Text></TouchableOpacity>
    </View>
    </>

  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fcfcfd" },
  header: { alignItems: "center", marginBottom: 20, backgroundColor: "#141428" },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 5, borderWidth: 2, borderColor: "#fff" },
  editPhoto: { color: "#ccc", fontSize: 14, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  info: { color: "#ccc", marginTop: 5 },
  
  statsBox: {
    flexDirection: "row",
    justifyContent: "space-around",
  
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
   
  },

  statsItem: { color: "#faf9f9", fontWeight: "800",  fontSize: 20, borderWidth:1, borderColor: "#edd8a4", borderRadius: 20, padding: 30,paddingBottom: 60, paddingTop:60, backgroundColor: "#2f3036" },

  sectionBox: {
    backgroundColor: "#f1f5f5",
    padding: 15,
    //borderWidth:10,
    //borderColor: "#2d2d2d",
    borderRadius: 20,
    marginVertical: 10,
    color: "#0e0d0d"
  },
  //sectionBoxText: { textAlign: "center" },

  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#040303", marginBottom: 10 },

  docBox: { backgroundColor: "#f1f5f5", padding: 12, marginVertical: 5 },

  docText: { color: "#0e0d0d", backgroundColor: "#f1f5f5" },
  button: { backgroundColor: "#f1f5f5", padding: 12,  marginVertical: 5,  },
  
  
  navBar: { flexDirection: "row", justifyContent: "space-around", marginTop: 20, backgroundColor: "#fcfcfd", padding: 10, borderRadius: 10 },
});
