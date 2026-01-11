import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wccjieterjvfwnrqphni.supabase.co'; 
// Clave pública (Anon) para acceso desde el navegador
const supabaseAnonKey = 'sb_publishable_PwaRuOfDqQOuX4q9v5f7Bw_ERKKPYcC'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);