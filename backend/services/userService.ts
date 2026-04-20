import { supabase } from '../../lib/supabase'

// CREER UN UTILISATEUR
<<<<<<< HEAD
export const createUser = async (phone:any, full_name:any, role:any) => {
=======
export const createUser = async (id,phone, full_name, role) => {
>>>>>>> b8e5d361cd84737f850180edb51349ebb9d0ba45
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
