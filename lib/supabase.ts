import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tqxkonlnoutyovupyfzr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxeGtvbmxub3V0eW92dXB5ZnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzg1MDcsImV4cCI6MjA2MDcxNDUwN30.H2GygqiULKC4XNIhNid-yPlprdbb3iKmtvHcPU3t3p8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
