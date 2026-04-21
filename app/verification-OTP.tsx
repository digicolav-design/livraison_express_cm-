import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  StatusBar, SafeAreaView, TextInput,
} from 'react-native';
import { router } from 'expo-router';

export default function VerificationOTPScreen() {
  const [code, setCode] = useState(['3', '8', '9', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080C1A" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerIcon}>
          <Text style={{ fontSize: 26 }}>💬</Text>
        </View>
        <Text style={styles.headerTitle}>Code de vérification</Text>
        <Text style={styles.headerSub}>
          SMS envoyé au{' '}
          <Text style={{ color: '#FFB800' }}>+237 6 71 23 45 67</Text>
        </Text>
      </View>

      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.cardContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.otpLabel}>Entre les 6 chiffres reçus par SMS</Text>

        <View style={styles.otpRow}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => {
                inputs.current[index] = el;
              }}
              style={[
                styles.otpBox,
                digit ? styles.otpBoxFilled : null,
                index === 3 && !digit ? styles.otpBoxActive : null,
              ]}
              value={digit}
              onChangeText={(text) => handleChange(text.slice(-1), index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <Text style={styles.timer}>
          Renvoyer dans <Text style={styles.timerBold}>47s</Text>
        </Text>

        <TouchableOpacity
          style={styles.btnBlue}
          onPress={() => router.push('/accueil-client')}
        >
          <Text style={styles.btnBlueText}>✓ Valider le code</Text>
        </TouchableOpacity>

        <View style={styles.helpBox}>
          <Text style={styles.helpText}>
            📌 Tu ne reçois pas le SMS ? Vérifie ton numéro ou contacte le support :{' '}
            <Text style={styles.helpBold}>+237 6XX XX XX XX</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#080C1A',
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 36,
  },
  backBtn: {
    width: 32, height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  headerIcon: {
    width: 52, height: 52, backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  card: {
    flex: 1, backgroundColor: '#fff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -18,
  },
  cardContent: { padding: 20, alignItems: 'center', paddingBottom: 40 },
  otpLabel: { fontSize: 14, fontWeight: '600', color: '#111827', textAlign: 'center', marginBottom: 20 },
  otpRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  otpBox: {
    width: 44, height: 54, borderWidth: 2, borderColor: '#E5E4DF',
    borderRadius: 12, backgroundColor: '#F9FAFB',
    fontSize: 22, fontWeight: '800', color: '#111827',
  },
  otpBoxFilled: { borderColor: '#0A2FCC', backgroundColor: '#EEF2FF', color: '#0A2FCC' },
  otpBoxActive: { borderColor: '#FFB800', backgroundColor: '#FFF8ED' },
  timer: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  timerBold: { color: '#0A2FCC', fontWeight: '700' },
  btnBlue: {
    backgroundColor: '#0A2FCC', borderRadius: 13, paddingVertical: 14,
    width: '100%', alignItems: 'center',
    shadowColor: '#0A2FCC', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 10, elevation: 6,
  },
  btnBlueText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  helpBox: { backgroundColor: '#F9FAFB', borderRadius: 11, padding: 12, marginTop: 16, width: '100%' },
  helpText: { fontSize: 11, color: '#6B7280', textAlign: 'center', lineHeight: 18 },
  helpBold: { color: '#0A2FCC', fontWeight: '700' },
});
