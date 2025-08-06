import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getServerSupabaseClient() {
    if (!supabaseServiceRoleKey) {
        console.error("service role key is not set. FIX IT")
        return null;
    }
    return createClient(supabaseUrl, supabaseServiceRoleKey);
}