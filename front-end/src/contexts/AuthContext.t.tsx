/**
 * Authentication Context
 * Manages user authentication state across the application
 */

/**
 * IMPORTS
 */
import { createContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserProfile, SupabaseUser } from 'src/types/user';

/**
 * EXPORTS
 */
// Auth context interface
export interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, phone?: string, birthday?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
