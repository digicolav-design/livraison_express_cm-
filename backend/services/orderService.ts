import { supabase } from "../../lib/supabase";

// 📦 créer une commande
export const createOrder = async (order:any) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select();

  return { data, error };
};

// 📦 récupérer les commandes d’un user
export const getOrdersByUser = async (user_id : any) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user_id);

  return { data, error };
};
