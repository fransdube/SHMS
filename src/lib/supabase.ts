import { createClient } from "@supabase/supabase-js";

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase environment variables, using dummy fallback values.");
    supabaseUrl = "https://dummy.supabase.co";
    supabaseAnonKey = "dummy-key";
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
