import { supabase } from '../../lib/supabase';

// CRÉER UN UTILISATEUR
export const createUser = async (id: string, full_name: string, phone: string, role: string = 'client') => {
  const { data, error } = await supabase
    .from("users")
    .upsert({ 
      id: id, 
      full_name: full_name, 
      phone: phone, 
      role: role 
    });
  
  return { data, error };
};