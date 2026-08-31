import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  process.env.REACT_APP_SUPABASE_URL &&
  process.env.REACT_APP_SUPABASE_ANON_KEY &&
  !process.env.REACT_APP_SUPABASE_URL.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables not configured. Running in offline/mock fallback mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
