import { supabase } from "../../lib/supabase";

// 🔐 Inscription
export const signUp = async (email:string, password :string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
   return { data, error };
};

/*export const signUp = async (telephone: any) => {
  const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+237672455471'
})

  return { data, error };
};

export const verifyOtp = async (telephone: any, token :any) => {
  const { data, error } = await supabase.auth.verifyOtp({
  phone: '+237672455471',
  token: '123456',
  type: 'sms'
})

  return { data, error };
};
*/


// 🔐 Connexion
export const signIn = async (email:string, password:string) => {
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
