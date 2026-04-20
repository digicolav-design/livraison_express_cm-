import { supabase } from "../../lib/supabase";

// 🔐 Inscription
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
};

// 🔐 Connexion
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

// 🚪 Déconnexion
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
