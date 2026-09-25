import { createClient } from '@supabase/supabase-js';

// Access environment variables using import.meta.env for Vite (fallback to dummy for preview without DB)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dummy-placeholder.supabase.co"; 
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseKey);