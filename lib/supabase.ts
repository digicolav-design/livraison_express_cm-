import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { createClient } from "@supabase/supabase-js";

// ← La ligne react-native-url-polyfill a été supprimée

const supabaseUrl = "https://wipiikecrkputwytotwu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcGlpa2VjcmtwdXR3eXRvdHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTk4MTksImV4cCI6MjA5MTc5NTgxOX0.dw1n1aMs-NpBi3zOdGM5J58xmcpDO2Uum8KSKg1HXbw";

const isWeb = Platform.OS === "web";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isWeb ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});