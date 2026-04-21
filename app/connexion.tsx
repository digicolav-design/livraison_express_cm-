import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, SafeAreaView,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';

export default function ConnexionScreen() {
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  // Indique si l'utilisateur a tenté de soumettre
  const [soumis, setSoumis] = useState(false);

  const emailValide = email.includes('@') && email.includes('.');

  const handleSoumettre = () => {
    setSoumis(true);
    if (emailValide) {
      router.push('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* BOUTON RETOUR */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>◀ Retour</Text>
          </TouchableOpacity>

          {/* TITRE */}
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>
            Entre ton adresse email pour recevoir un code de vérification
          </Text>

          {/* NOTE CHAMP OBLIGATOIRE */}
          <View style={styles.obligatoireNote}>
            <Text style={styles.obligatoireEtoile}>*</Text>
            <Text style={styles.obligatoireTexte}> Ce champ est obligatoire</Text>
          </View>

          {/* LABEL AVEC ÉTOILE ROUGE */}
          <View style={styles.labelRow}>
            <Text style={styles.labelText}>ADRESSE EMAIL</Text>
            {/* Étoile rouge obligatoire */}
            <Text style={styles.labelEtoile}> *</Text>
          </View>

          {/* CHAMP EMAIL */}
          <View style={[
            styles.inputContainer,
            emailFocused && styles.inputContainerFocused,
            // Bordure rouge si soumis et email invalide
            soumis && !emailValide && styles.inputContainerError,
          ]}>
            <View style={styles.inputIconBox}>
              <Text style={styles.inputIcon}>✉️</Text>
            </View>
            <View style={styles.inputDivider} />
            <TextInput
              style={styles.input}
              placeholder="exemple@gmail.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
            {emailValide && <Text style={styles.validIcon}>✓</Text>}
          </View>

          {/* MESSAGE D'ERREUR sous le champ */}
          {soumis && !emailValide && (
            <Text style={styles.erreurMsg}>
              ⚠️ Veuillez entrer une adresse email valide
            </Text>
          )}

          {/* INFO SMS */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Un code à 6 chiffres te sera envoyé par email
            </Text>
          </View>

          {/* BOUTON */}
          <TouchableOpacity
            style={[
              styles.btnPrimary,
              !emailValide && styles.btnPrimaryDisabled,
            ]}
            onPress={handleSoumettre}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPrimaryText}>Recevoir le code →</Text>
          </TouchableOpacity>

          {/* CONDITIONS */}
          <Text style={styles.termsText}>
            En continuant, tu acceptes nos{' '}
            <Text style={styles.termsLink}>Conditions d'utilisation</Text>
            {' '}et notre{' '}
            <Text style={styles.termsLink}>Politique de confidentialité</Text>
          </Text>

          {/* BANDEAU SÉCURITÉ */}
          <View style={styles.securityBanner}>
            <Text style={styles.securityText}>
              🔒 Tes données sont protégées et sécurisées
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: 32 },
  backBtnText: { fontSize: 14, color: '#0A2FCC', fontWeight: '600' },
  title: { fontSize: 30, fontWeight: '800', color: '#111827', marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#6B7280', lineHeight: 22, marginBottom: 20 },

  // Note champ obligatoire
  obligatoireNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  obligatoireEtoile: { fontSize: 14, fontWeight: '800', color: '#FF4D4D' },
  obligatoireTexte: { fontSize: 11, color: '#FF4D4D', fontWeight: '500' },

  // Label avec étoile rouge
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // L'étoile rouge *
  labelEtoile: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF4D4D',
    lineHeight: 16,
  },

  // Champ email
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E4DF',
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    marginBottom: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  inputContainerFocused: {
    borderColor: '#0A2FCC',
    backgroundColor: '#fff',
    shadowColor: '#0A2FCC',
    shadowOpacity: 0.12,
    elevation: 3,
  },
  // Bordure rouge si erreur
  inputContainerError: {
    borderColor: '#FF4D4D',
    backgroundColor: '#FEF2F2',
  },
  inputIconBox: {
    paddingHorizontal: 14, paddingVertical: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center', justifyContent: 'center',
  },
  inputIcon: { fontSize: 20 },
  inputDivider: { width: 1, height: '100%', backgroundColor: '#C7D2FE' },
  input: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 16,
    fontSize: 16, color: '#111827', fontWeight: '500',
  },
  validIcon: {
    fontSize: 18, color: '#00C48C',
    fontWeight: '700', paddingRight: 14,
  },

  // Message d'erreur
  erreurMsg: {
    fontSize: 11,
    color: '#FF4D4D',
    fontWeight: '500',
    marginBottom: 10,
    marginLeft: 4,
  },

  infoBox: {
    backgroundColor: '#EEF2FF', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 13, marginBottom: 28,
  },
  infoText: { fontSize: 14, color: '#0A2FCC', fontWeight: '500', lineHeight: 20 },

  btnPrimary: {
    backgroundColor: '#0A2FCC', borderRadius: 16,
    paddingVertical: 17, alignItems: 'center', marginBottom: 20,
    shadowColor: '#0A2FCC', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  btnPrimaryDisabled: { backgroundColor: '#93A3D4', shadowOpacity: 0, elevation: 0 },
  btnPrimaryText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },

  termsText: {
    fontSize: 13, color: '#6B7280',
    textAlign: 'center', lineHeight: 20, marginBottom: 32,
  },
  termsLink: { color: '#0A2FCC', fontWeight: '700' },

  securityBanner: {
    backgroundColor: '#EEF2FF', borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center',
  },
  securityText: { fontSize: 14, color: '#0A2FCC', fontWeight: '600' },
});