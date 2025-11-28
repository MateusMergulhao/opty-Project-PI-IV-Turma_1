/**
 * IMPORTS
 */
import { User as SupabaseAuthUser } from '@supabase/supabase-js';

/**
 * EXPORTS
 */

/**
 * Supabase user model (authentication)
 */
export type SupabaseUser = SupabaseAuthUser;

/**
 * Backend user profile
 */
export interface UserProfile {
  supabase_id: string;
  email: string;
  name: string;
  phone?: string;
  birthday?: string;
  avatar_url?: string;
  created_at: string;
  is_active: boolean;
  role: 'user' | 'supervisor';
}
