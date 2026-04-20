import { supabase } from '../../lib/supabase'

// CREER UN UTILISATEUR
export const createUser = async (id,phone, full_name, role) => {
  const { data, error } = await supabase
    .from("users")
    .upsert(
      [{id, phone, full_name, role }],
      { onConflict: "phone" }
    )
    .select();

  return { data, error };
};

// RECUPERER TOUS LES UTILISATEURS
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')

  return { data, error }
}

// CONNEXION PAR TELEPHONE
//export const loginUser = async (phone) => {
  //const { data, error } = await supabase
    //.from('users')
    //.select('*')
    //.eq('phone', phone)
    //.single()

  //return { data, error }
//}
