import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://wipiikecrkputwytotwu.supabase.co';       // ← Mets l'url du projetsupabase
const supabaseAnonKey = 'VOTRE_SUPABASE_ANOeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcGlpa2VjcmtwdXR3eXRvdHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTk4MTksImV4cCI6MjA5MTc5NTgxOX0.dw1n1aMs-NpBi3zOdGM5J58xmcpDO2Uum8KSKg1HXbw'; // ← remplace ici

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});