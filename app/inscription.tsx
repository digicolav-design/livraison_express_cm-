import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

const PAYS = [
  { code: "+237", drapeau: "🇨🇲", nom: "Cameroun" },
  { code: "+225", drapeau: "🇨🇮", nom: "Côte d'Ivoire" },
  { code: "+221", drapeau: "🇸🇳", nom: "Sénégal" },
  { code: "+223", drapeau: "🇲🇱", nom: "Mali" },
  { code: "+226", drapeau: "🇧🇫", nom: "Burkina Faso" },
  { code: "+227", drapeau: "🇳🇪", nom: "Niger" },
  { code: "+228", drapeau: "🇹🇬", nom: "Togo" },
  { code: "+229", drapeau: "🇧🇯", nom: "Bénin" },
  { code: "+233", drapeau: "🇬🇭", nom: "Ghana" },
  { code: "+234", drapeau: "🇳🇬", nom: "Nigeria" },
  { code: "+236", drapeau: "🇨🇫", nom: "Centrafrique" },
  { code: "+241", drapeau: "🇬🇦", nom: "Gabon" },
  { code: "+242", drapeau: "🇨🇬", nom: "Congo" },
  { code: "+243", drapeau: "🇨🇩", nom: "RD Congo" },
  { code: "+244", drapeau: "🇦🇴", nom: "Angola" },
  { code: "+33", drapeau: "🇫🇷", nom: "France" },
  { code: "+32", drapeau: "🇧🇪", nom: "Belgique" },
  { code: "+41", drapeau: "🇨🇭", nom: "Suisse" },
  { code: "+1", drapeau: "🇺🇸", nom: "États-Unis" },
  { code: "+44", drapeau: "🇬🇧", nom: "Royaume-Uni" },
];

// Composant réutilisable : Label avec étoile rouge obligatoire
// On l'utilise pour chaque champ obligatoire
function LabelObligatoire({ texte }: { texte: string }) {
  return (
    <View style={labelStyles.row}>
      <Text style={labelStyles.text}>{texte}</Text>
      {/* Étoile rouge indiquant que le champ est obligatoire */}
      <Text style={labelStyles.etoile}> *</Text>
    </View>
  );
}

const labelStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 7,
  },
  text: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // L'étoile rouge *
  etoile: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FF4D4D",
    lineHeight: 16,
  },
});

export default function InscriptionScreen() {
  const [paysSelectionne, setPaysSelectionne] = useState(PAYS[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [genre, setGenre] = useState("");
  const [telephone, setTelephone] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [recherche, setRecherche] = useState("");
  const [nomFocused, setNomFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [telFocused, setTelFocused] = useState(false);
  // Indique si l'utilisateur a essayé de soumettre (pour afficher les erreurs)
  const [soumis, setSoumis] = useState(false);

  const paysFiltres = PAYS.filter(
    (p) =>
      p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      p.code.includes(recherche),
  );

  const emailValide = email.includes("@") && email.includes(".");
  const nomValide = nom.trim().length > 2;
  const telValide = telephone.length >= 6;
  const genreValide = genre !== "";
  const formulaireValide = nomValide && emailValide && telValide && genreValide;

  // Appelé quand on appuie sur le bouton créer
  // Appelé quand on appuie sur le bouton créer
  const handleSoumettre = async () => {
    setSoumis(true);

    if (!formulaireValide) return;

    try {
      // 🔐 Création du compte
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true, // crée le compte si inexistant
        },
      });
      console.log("DATA AUTH:", data);
      console.log("ERROR AUTH:", error);

      if (error) {
        console.log("Erreur Auth:", error.message);
        return;
      }

      // 🔥 Récupération sécurisée du user
      /*const user = data?.user || data?.session?.user;

      if (!user) {
        console.log("Utilisateur non récupéré ❌");
        return;
      }

      console.log("USER ID:", user.id);

      // 🗄️ Insertion DB
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id,
          full_name: nom,
          email: email,
          phone: paysSelectionne.code + telephone,
          genre: genre,
          role: "client",
        },
      ]);*/

      /*console.log("INSERT ERROR:", insertError);

      if (insertError) {
        console.log("Erreur insertion:", insertError.message);
        return;
      }*/

      console.log("✅ Insertion réussie");

      router.push({
        pathname: "/verification-OTP",
        params: { email },
      });
    } catch (err) {
      console.log("Erreur générale:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A2FCC" />

      {/* ══ MODAL SÉLECTION PAYS ══ */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🌍 Choisir un pays</Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => {
                  setModalVisible(false);
                  setRecherche("");
                }}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearch}>
              <Text style={styles.modalSearchIcon}>🔍</Text>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Rechercher un pays ou un indicatif..."
                placeholderTextColor="#9CA3AF"
                value={recherche}
                onChangeText={setRecherche}
              />
              {recherche.length > 0 && (
                <TouchableOpacity onPress={() => setRecherche("")}>
                  <Text
                    style={{ fontSize: 14, color: "#9CA3AF", paddingRight: 8 }}
                  >
                    ✕
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.modalResultCount}>
              {paysFiltres.length} pays disponible
              {paysFiltres.length > 1 ? "s" : ""}
            </Text>
            <FlatList
              data={paysFiltres}
              keyExtractor={(item) => item.code + item.nom}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const estSelectionne =
                  paysSelectionne.code === item.code &&
                  paysSelectionne.nom === item.nom;
                return (
                  <TouchableOpacity
                    style={[
                      styles.paysItem,
                      estSelectionne && styles.paysItemSelected,
                    ]}
                    onPress={() => {
                      setPaysSelectionne(item);
                      setModalVisible(false);
                      setRecherche("");
                    }}
                  >
                    <Text style={styles.paysDrapeau}>{item.drapeau}</Text>
                    <Text
                      style={[
                        styles.paysNom,
                        estSelectionne && styles.paysNomSelected,
                      ]}
                    >
                      {item.nom}
                    </Text>
                    <View
                      style={[
                        styles.paysCodeBadge,
                        estSelectionne && styles.paysCodeBadgeSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.paysCode,
                          estSelectionne && styles.paysCodeSelected,
                        ]}
                      >
                        {item.code}
                      </Text>
                    </View>
                    {estSelectionne && <Text style={styles.paysCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptySearch}>
                  <Text style={styles.emptySearchIcon}>🔍</Text>
                  <Text style={styles.emptySearchText}>
                    Aucun pays trouvé pour "{recherche}"
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* ══ EN-TÊTE BLEUE ══ */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer un compte</Text>
        <Text style={styles.headerSub}>Rejoins Livraison Express CM</Text>
      </View>

      {/* ══ FORMULAIRE DÉFILABLE ══ */}
      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.cardContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Note explicative sur les champs obligatoires */}
        <View style={styles.obligatoireNote}>
          <Text style={styles.obligatoireEtoile}>*</Text>
          <Text style={styles.obligatoireTexte}>
            {" "}
            Les champs marqués d'une étoile sont obligatoires
          </Text>
        </View>

        {/* ── PHOTO ── */}
        <View style={styles.avatarWrap}>
          <TouchableOpacity style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>😊</Text>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Appuie pour ajouter une photo</Text>
        </View>

        {/* ── NOM COMPLET ── */}
        <LabelObligatoire texte="Nom complet" />
        <View
          style={[
            styles.inputRow,
            nomFocused && styles.inputRowFocused,
            // Bordure rouge si soumis et champ invalide
            soumis && !nomValide && styles.inputRowError,
          ]}
        >
          <Text style={styles.inputIcon}>👤</Text>
          <View style={styles.inputDivider} />
          <TextInput
            style={styles.input}
            placeholder="Ex : Paul Mbarga"
            placeholderTextColor="#9CA3AF"
            value={nom}
            onChangeText={setNom}
            onFocus={() => setNomFocused(true)}
            onBlur={() => setNomFocused(false)}
          />
          {nomValide && <Text style={styles.validIcon}>✓</Text>}
        </View>
        {/* Message d'erreur si soumis et nom invalide */}
        {soumis && !nomValide && (
          <Text style={styles.erreurMsg}>
            ⚠️ Veuillez entrer votre nom complet
          </Text>
        )}

        {/* ── EMAIL ── */}
        <LabelObligatoire texte="Adresse email" />
        <View
          style={[
            styles.inputRow,
            emailFocused && styles.inputRowFocused,
            soumis && !emailValide && styles.inputRowError,
          ]}
        >
          <Text style={styles.inputIcon}>✉️</Text>
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
        {soumis && !emailValide && (
          <Text style={styles.erreurMsg}>
            ⚠️ Veuillez entrer un email valide
          </Text>
        )}

        {/* ── TÉLÉPHONE AVEC MENU DÉROULANT PAYS ── */}
        <LabelObligatoire texte="Numéro de téléphone" />
        <View
          style={[
            styles.phoneRow,
            telFocused && styles.phoneRowFocused,
            soumis && !telValide && styles.inputRowError,
          ]}
        >
          <TouchableOpacity
            style={styles.flagBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.flagDrapeau}>{paysSelectionne.drapeau}</Text>
            <Text style={styles.flagCode}>{paysSelectionne.code}</Text>
            <Text style={styles.flagArrow}>▾</Text>
          </TouchableOpacity>
          <View style={styles.phoneDivider} />
          <TextInput
            style={styles.phoneInput}
            placeholder="6 71 23 45 67"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            value={telephone}
            onChangeText={setTelephone}
            onFocus={() => setTelFocused(true)}
            onBlur={() => setTelFocused(false)}
          />
          {telValide && <Text style={styles.validIcon}>✓</Text>}
        </View>
        {soumis && !telValide && (
          <Text style={styles.erreurMsg}>
            ⚠️ Veuillez entrer un numéro valide
          </Text>
        )}
        {telephone.length > 0 && (
          <View style={styles.previewBox}>
            <Text style={styles.previewText}>
              📱 Numéro complet : {paysSelectionne.code} {telephone}
            </Text>
          </View>
        )}

        {/* ── GENRE ── */}
        <LabelObligatoire texte="Genre" />
        <View style={styles.genderRow}>
          {[
            { key: "homme", label: "👨 Homme" },
            { key: "femme", label: "👩 Femme" },
            { key: "autre", label: "— Autre" },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.genderOpt,
                genre === opt.key && styles.genderOptSel,
                // Bordure rouge si genre non sélectionné après soumission
                soumis && !genreValide && styles.genderOptError,
              ]}
              onPress={() => setGenre(opt.key)}
            >
              <Text
                style={[
                  styles.genderOptText,
                  genre === opt.key && styles.genderOptTextSel,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {soumis && !genreValide && (
          <Text style={styles.erreurMsg}>
            ⚠️ Veuillez sélectionner votre genre
          </Text>
        )}

        {/* ── BOUTON CRÉER ── */}
        <TouchableOpacity
          style={[styles.btnBlue, !formulaireValide && styles.btnBlueDisabled]}
          onPress={handleSoumettre}
          activeOpacity={0.8}
        >
          <Text style={styles.btnBlueText}>Créer mon compte →</Text>
        </TouchableOpacity>

        {/* ── TEXTES LÉGAUX ── */}
        <Text style={styles.terms}>
          En continuant, tu acceptes nos{" "}
          <Text style={styles.link}>Conditions</Text> et notre{" "}
          <Text style={styles.link}>Politique de confidentialité</Text>
        </Text>

        <Text style={styles.already}>
          Déjà inscrit ?{" "}
          <Text style={styles.link} onPress={() => router.push("/connexion")}>
            Se connecter
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Note obligatoire en haut du formulaire
  obligatoireNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  obligatoireEtoile: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FF4D4D",
  },
  obligatoireTexte: {
    fontSize: 11,
    color: "#FF4D4D",
    fontWeight: "500",
  },

  // ══ MODAL ══
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 8,
    maxHeight: "82%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 6,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: { fontSize: 17, fontWeight: "800", color: "#111827" },
  modalClose: {
    width: 32,
    height: 32,
    backgroundColor: "#F3F4F6",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: { fontSize: 13, color: "#6B7280", fontWeight: "700" },
  modalSearch: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginHorizontal: 14,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#E5E4DF",
    gap: 8,
  },
  modalSearchIcon: { fontSize: 16 },
  modalSearchInput: { flex: 1, fontSize: 14, color: "#111827" },
  modalResultCount: {
    fontSize: 11,
    color: "#9CA3AF",
    paddingHorizontal: 18,
    marginBottom: 4,
    fontWeight: "500",
  },
  paysItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  paysItemSelected: { backgroundColor: "#EEF2FF" },
  paysDrapeau: { fontSize: 24 },
  paysNom: { flex: 1, fontSize: 14, fontWeight: "500", color: "#111827" },
  paysNomSelected: { color: "#0A2FCC", fontWeight: "700" },
  paysCodeBadge: {
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  paysCodeBadgeSelected: { backgroundColor: "#C7D2FE" },
  paysCode: { fontSize: 12, fontWeight: "700", color: "#374151" },
  paysCodeSelected: { color: "#0A2FCC" },
  paysCheck: {
    fontSize: 16,
    color: "#0A2FCC",
    fontWeight: "800",
    marginLeft: 4,
  },
  emptySearch: { alignItems: "center", paddingVertical: 40, gap: 10 },
  emptySearchIcon: { fontSize: 32 },
  emptySearchText: { fontSize: 13, color: "#9CA3AF", textAlign: "center" },

  // ══ EN-TÊTE ══
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
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.65)" },

  // ══ CARTE BLANCHE ══
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -18,
  },
  cardContent: { padding: 20, paddingBottom: 50 },

  // Avatar
  avatarWrap: { alignItems: "center", marginBottom: 8, marginTop: 4 },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    borderWidth: 2,
    borderColor: "#0A2FCC",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: { fontSize: 34 },
  avatarHint: { fontSize: 10, color: "#6B7280", marginTop: 6 },

  // ── Champs ──
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E4DF",
    borderRadius: 12,
    overflow: "hidden",
  },
  inputRowFocused: {
    borderColor: "#0A2FCC",
    backgroundColor: "#fff",
    shadowColor: "#0A2FCC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  // Bordure rouge en cas d'erreur après soumission
  inputRowError: {
    borderColor: "#FF4D4D",
    backgroundColor: "#FEF2F2",
  },
  inputIcon: { fontSize: 18, paddingHorizontal: 13, paddingVertical: 13 },
  inputDivider: { width: 1, height: 42, backgroundColor: "#E5E4DF" },
  input: {
    flex: 1,
    paddingHorizontal: 13,
    paddingVertical: 13,
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  validIcon: {
    fontSize: 16,
    color: "#00C48C",
    fontWeight: "800",
    paddingRight: 13,
  },

  // Message d'erreur sous les champs
  erreurMsg: {
    fontSize: 11,
    color: "#FF4D4D",
    fontWeight: "500",
    marginTop: 5,
    marginLeft: 4,
  },

  // ── Téléphone ──
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E4DF",
    borderRadius: 12,
    overflow: "hidden",
  },
  phoneRowFocused: {
    borderColor: "#0A2FCC",
    backgroundColor: "#fff",
    shadowColor: "#0A2FCC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  flagBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 13,
    backgroundColor: "#EEF2FF",
    gap: 5,
  },
  flagDrapeau: { fontSize: 20 },
  flagCode: { fontSize: 12, fontWeight: "700", color: "#0A2FCC" },
  flagArrow: { fontSize: 11, color: "#0A2FCC", marginLeft: 1 },
  phoneDivider: { width: 1, height: 42, backgroundColor: "#C7D2FE" },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 13,
    paddingVertical: 13,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    letterSpacing: 0.5,
  },
  previewBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 7,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  previewText: { fontSize: 12, color: "#059669", fontWeight: "600" },

  // ── Genre ──
  genderRow: { flexDirection: "row", gap: 7 },
  genderOpt: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E4DF",
    borderRadius: 11,
    paddingVertical: 10,
    alignItems: "center",
  },
  genderOptSel: { borderColor: "#0A2FCC", backgroundColor: "#EEF2FF" },
  // Bordure rouge si genre non sélectionné
  genderOptError: { borderColor: "#FF4D4D", backgroundColor: "#FEF2F2" },
  genderOptText: { fontSize: 11, fontWeight: "600", color: "#6B7280" },
  genderOptTextSel: { color: "#0A2FCC" },

  // ── Bouton ──
  btnBlue: {
    backgroundColor: "#0A2FCC",
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#0A2FCC",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  btnBlueDisabled: {
    backgroundColor: "#93A3D4",
    shadowOpacity: 0,
    elevation: 0,
  },
  btnBlueText: { fontSize: 15, fontWeight: "700", color: "#fff" },

  terms: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 16,
    marginTop: 14,
  },
  already: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 10,
  },
  link: { color: "#0A2FCC", fontWeight: "700" },
});
