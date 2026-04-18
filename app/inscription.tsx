import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, Link } from "expo-router";
import { createUser } from "../backend/services/userService";
import { signUp } from "../backend/services/authService";

export default function SignUpScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

 const handleSubmit = async () => {
  if (!name || !email || !phone || !password) {
    Alert.alert("Erreur", "Tous les champs sont obligatoires !");
    return;
  }

  if (password.length < 8) {
    Alert.alert("Erreur", "Mot de passe trop court");
    return;
  }

  // 🔐 1. créer compte auth
  const { data: authData, error: authError } = await signUp(email, password);

  if (authError) {
    Alert.alert("Erreur", authError.message);
    return;
  }

  // 👤 2. créer profil user
  const { data, error } = await createUser(phone, name, "client");

  if (error) {
    Alert.alert("Erreur", error.message);
    return;
  }

  Alert.alert("Succès", "Compte créé !");
  router.push("/connexion");
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <Text style={styles.label}>Nom</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Téléphone</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} />

      <Text style={styles.label}>Mot de passe</Text>
      <TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Créer compte</Text>
      </TouchableOpacity>

      <Text style={styles.link}>
        Déjà un compte ? <Link href="/connexion">Se connecter</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A56DB', marginBottom: 40, textAlign: 'center' },
  label: { fontSize: 14, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 16 },
  button: { backgroundColor: '#1A56DB', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 20, textAlign: 'center', color: '#F5A623' },
});
