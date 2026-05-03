import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  StatusBar,

} from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';


{/*definition type document*/}

type Documents = {
  cni: any | null;
  permis: any | null;
  carteGrise: any | null;
  assurance: any | null;
};

export default function CourierRegistration() {
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [documents, setDocuments] = useState<Documents>({
    cni: null,
    permis: null,
    carteGrise: null,
    assurance: null,
  });
  // Indique si l'utilisateur a essayé de soumettre (pour afficher les erreurs)
  const [soumis, setSoumis] = useState(false);



  {/*importation des documents*/}

  const pickDocument = async (type: keyof Documents) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      if (!result.canceled) {
        setDocuments({ ...documents, [type]: result.assets[0] });
      }
    } catch (err) {
      console.log('Erreur lors de l’importation', err);
    }
  };

  {/*champ obligatoire*/}
  const handleSubmit = () => {
    if (!nom || !email || !Object.values(documents).some((doc) => doc === null)) {
      Alert.alert('Attention', 'Veuillez remplir tous les champs et importer tous les documents.');
      return;
    }
    Alert.alert(
      'Succès',
      'Votre demande a été soumise.\nValidation sous 72h max après soumission des documents complet.'
    );
  };
 

  return (
    <View style={styles.container}>



        {/*titer*/}

      <View style={styles.header}>
        
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                  <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          
            {/*logo*/}
         <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🏍️</Text>
         </View>
          <Text style={styles.headerTitle}>DEVENIR COURSIE</Text>
          <Text style={styles.headerSubtitle}>Gagne ta vie avec tes livraisons</Text>
      </View>
    

        {/*remplissage*/}

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Nom complet *</Text>
        <TextInput
          style={styles.input}
          placeholder="Jean-Baptiste Kouassi"
          value={nom}
          onChangeText={setNom}
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="exemple@email.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.sectionTitle}>Documents requis *</Text>


  
          {(Object.keys(documents) as (keyof Documents)[]).map((doc) => (
            <TouchableOpacity
              key={doc}
              style={[
                styles.uploadButton,
                documents[doc] && styles.uploadedButton,
              ]}
              onPress={() => pickDocument(doc)}
            >
              <Text style={styles.uploadText}>
                {doc === "cni" && "🪪 "}
                {doc === "permis" && "🚘 "}
                {doc === "carteGrise" && "📄 "}
                {doc === "assurance" && "🛡️ "}
                {doc.toUpperCase()}{" "}
                {documents[doc]
                  ? `✓ ${documents[doc].name}`
                  : "(cliquer pour importer)"}
              </Text>
            </TouchableOpacity>
        ))}


        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Link href="/validation_coursier">
            <Text style={styles.submitText} > 
             Soumettre ma demande
             </Text>
          </Link>
        </TouchableOpacity>

        <Text style={styles.validationMsg}>
          Validation sous 72h max après soumission des documents complet
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  header: {
    backgroundColor: "#0A2FCC",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 36,
  },
  backBtn: {
    width: 32,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  backBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
 
  container: { flex: 1, backgroundColor:  '#050b25' },
  
  headerSubtitle: { fontSize: 20, color: '#fff', marginTop: 15 },
  form: { padding: 20 },
  label: { marginTop: 10, fontWeight: '600', color: '#adacac' },
  input: {
    borderWidth: 2,
    borderColor: '#4d50f5',
    borderRadius:   10,
    padding: 10,
    marginTop: 5,
    color: '#f7f4f4'
  },



  sectionTitle: { marginTop: 20, fontSize: 16, fontWeight: 'bold', color:'#fdf6f6' },
  documentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },

  uploadButton: {
    width: "40%", // deux boutons par ligne
    marginTop: 10,
    padding: 15,
    backgroundColor: "#212122",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
 
  uploadedButton: {
    backgroundColor: '#bdfbcc', // vert clair
    borderColor: 'green',       // bordure verte
  },

  uploadText: { color: '#f9f7f7' },

  submitButton: {

    marginTop: 30,
    backgroundColor: 'blue',
    padding: 15,
    borderRadius:  10,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: 'bold' },
  validationMsg: {
    marginTop: 15,
    fontSize: 12,
    color: '#9999af',
    textAlign: 'center',
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
});
