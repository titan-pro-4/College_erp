import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client if credentials are not configured
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'https://placeholder.supabase.co' || 
      supabaseAnonKey === 'placeholder-key') {
    console.warn('⚠️ Supabase not configured. Using mock data mode.');
    return null as any;
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
};

export const supabase = createSupabaseClient();

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  const isConfigured = Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseAnonKey !== 'placeholder-key' &&
    supabaseUrl !== 'https://your-project.supabase.co' && 
    supabaseAnonKey !== 'your-anon-key-here'
  );
  
  if (isConfigured) {
    console.log('✅ Supabase connected:', supabaseUrl);
  } else {
    console.log('⚠️ Supabase not configured, using mock data');
  }
  
  return isConfigured;
};
