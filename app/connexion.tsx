import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, Link } from "expo-router";
import { signIn } from "../backend/services/authService";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs !");
      return;
    }

    try {
      const { data, error } = await loginUser(email, password);

      if (error) {
        Alert.alert("Erreur", error.message);
        return;
      }

      Alert.alert("Succès", "Connexion réussie !");
      router.push("/"); // page d'accueil

    } catch (err) {
      Alert.alert("Erreur", "Problème serveur");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Livraison Express CM</Text>
      <Text style={styles.welcome}>Connexion</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Pas de compte ? <Link href="/inscription">S'inscrire</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  welcome: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  label: { marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 16 },
  button: { backgroundColor: '#1E90FF', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  footer: { textAlign: 'center', marginTop: 20 },
});
