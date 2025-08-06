import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error("Missing supabase url");
}
if (!supabaseAnonKey) {
  console.error("Missing ANON key");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)