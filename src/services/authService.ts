import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];

export class AuthService {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) throw userError;

    return { session: data.session, user: userData };
  }

  /**
   * Sign up new user
   */
  async signUp(email: string, password: string, userData: Omit<UserInsert, 'id' | 'email'>) {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Create user profile
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          ...userData,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { session: authData.session, user: data };
  }

  /**
   * Sign out current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Get user profile
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Get current session
   */
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  }
}

export const authService = new AuthService();
