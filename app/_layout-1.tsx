import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="inscription" />
      <Stack.Screen name="connexion" />
      <Stack.Screen name="verification-OTP" />
      <Stack.Screen name="accueil-client" />
      <Stack.Screen name="passer-commande" />
      <Stack.Screen name="confirmer-paiement" />
      <Stack.Screen name="suivi" />
      <Stack.Screen name="livraison-confirmer" />
      <Stack.Screen name="historique" />
      <Stack.Screen name="profil-client" />
    </Stack>
  );
}
