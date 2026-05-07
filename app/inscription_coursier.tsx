import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

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
  const [soumis, setSoumis] = useState(false); //  pour afficher erreurs

  const LabelObligatoire = ({ texte }: { texte: string }) => (
    <Text style={styles.label}>{texte} *</Text>
  );

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

  // Fonction utilitaire Alert (fallback Web)
  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${message}`);
      if (onConfirm) onConfirm();
    } else {
      Alert.alert(title, message, [{ text: 'OK', onPress: onConfirm }]);
    }
  };

  const handleSubmit = () => {
    setSoumis(true); //  active la validation visuelle

    const allDocsUploaded = Object.values(documents).every((doc) => doc !== null);

    if (!nom || !email || !allDocsUploaded) {
      showAlert('Attention', 'Veuillez remplir tous les champs et importer tous les documents.');
      return;
    }

    showAlert(
      'Succès',
      'Votre demande a été soumise.\nValidation sous 72h max après soumission des documents complet.',
      () => router.push('/validation_coursier')
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🏍️</Text>
        </View>
        <Text style={styles.headerTitle}>DEVENIR COURSIER</Text>
        <Text style={styles.headerSubtitle}>Gagne ta vie avec tes livraisons</Text>
      </View>

      {/* ── Formulaire ── */}
      <ScrollView contentContainerStyle={styles.form}>
        <LabelObligatoire texte="Nom complet" />
        <TextInput
          style={[
            styles.input,
            soumis && !nom && styles.inputError, //  bordure rouge si vide
          ]}
          placeholder="Jean-Baptiste Kouassi"
          value={nom}
          onChangeText={setNom}
        />

        <LabelObligatoire texte="Email" />
        <TextInput
          style={[
            styles.input,
            soumis && !email && styles.inputError, // bordure rouge si vide
          ]}
          placeholder="exemple@email.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <LabelObligatoire texte="Documents requis" />
        {(Object.keys(documents) as (keyof Documents)[]).map((doc) => (
          <TouchableOpacity
            key={doc}
            style={[
              styles.uploadButton,
              documents[doc] && styles.uploadedButton,
              soumis && !documents[doc] && styles.inputError, //  bordure rouge si non importé
            ]}
            onPress={() => pickDocument(doc)}
          >
            <Text style={styles.uploadText}>
              {doc === 'cni' && '🪪 '}
              {doc === 'permis' && '🚘 '}
              {doc === 'carteGrise' && '📄 '}
              {doc === 'assurance' && '🛡️ '}
              {doc.toUpperCase()}{" "}
              {documents[doc]
                ? `✓ ${documents[doc].name}`
                : '(cliquer pour importer)'}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Soumettre ma demande</Text>
        </TouchableOpacity>

        <Text style={styles.validationMsg}>
          Validation sous 72h max après soumission des documents complet
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050b25' },
  header: {
    backgroundColor: '#0A2FCC',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 36,
  },
  backBtn: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: { fontSize: 20, color: '#fff', marginTop: 15 },
  form: { padding: 20 },
  input: {
    borderWidth: 2,
    borderColor: '#4d50f5',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    color: '#f7f4f4',
  },
  inputError: {
    borderColor: 'red', // bordure rouge si champ vide
  },
  label: { marginTop: 10, fontSize: 16, fontWeight: '600', color: '#fdf6f6' },
  uploadButton: {
    width: '40%',
    marginTop: 10,
    padding: 15,
    backgroundColor: '#212122',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  uploadedButton: {
    backgroundColor: '#bdfbcc',
    borderColor: 'green',
  },
  uploadText: { color: '#f9f7f7' },
  submitButton: {
    marginTop: 30,
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoEmoji: { fontSize: 52 },
});

