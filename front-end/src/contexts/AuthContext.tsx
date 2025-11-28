/**
 * Authentication Context
 * Manages user authentication state across the application
 */

/**
 * IMPORTS
 */
import { useEffect, useState, ReactNode } from 'react';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { api } from '@/services/api';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext.t';
import {SupabaseUser, UserProfile} from 'src/types/user';


/**
 * INTERFACES
 */
interface AuthProviderProps {
  children: ReactNode;
}


/**
 * EXPORTS
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {

  // State variables
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      // Fetch profile from backend API
      const profile = await api.auth.getCurrentUser();

      // Set profile in state
      setUserProfile(profile);

    // Catch errors
    } catch (error: any) {

      // Log error
      console.error('Error fetching user profile:', error);

      // If profile doesn't exist (404), try to create it for OAuth users
      if (error.response?.status === 404) {

        // Attempt to create profile for OAuth user
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          // User exists: Extract name from user metadata or email
          if (user) {
            const name = user.user_metadata?.full_name ||
                        user.user_metadata?.name ||
                        user.email?.split('@')[0] ||
                        'User';

            // Create profile in backend (for OAuth users only)
            const createdProfile = await api.auth.createProfile({
              supabase_id: user.id,
              email: user.email!,
              name: name,
              phone: user.user_metadata?.phone,
              birthday: user.user_metadata?.birthday,
              avatar_url: user.user_metadata?.avatar_url,
            });

            // Set the newly created profile
            setUserProfile(createdProfile);
            return;
          }
        } catch (createError) {
          console.error('Error creating profile for OAuth user:', createError);
        }
      }

      // On other errors, clear profile
      setUserProfile(null);
    }
  };


  // Sign up with email/password
  const signUp = async (
    email: string,
    password: string,
    name: string,
    phone?: string,
    birthday?: string
  ) => {
    try {
      setLoading(true);

      // Call backend register endpoint
      await api.auth.register({
        email,
        password,
        name,
        phone,
        birthday,
      });

    } catch (error: any) {
      console.error('Sign up error:', error);

      // Handle specific backend errors
      if (error.response?.status === 409) {
        throw new Error('Usuário já existe. Tente fazer login.');
      }
      if (error.response?.status === 422) {
        throw new Error('Dados inválidos. Verifique os campos e tente novamente.');
      }

      throw new Error(error.response?.data?.detail || error.message || 'Falha ao criar conta');
    } finally {
      setLoading(false);
    }
  };


  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Call backend login endpoint
      const response = await api.auth.login({ email, password });

      // Backend returns
      const { token, user } = response;

      // Set user profile immediately
      setUserProfile(user);

      // Set session in Supabase with the tokens from backend
      const { data, error } = await supabase.auth.setSession({
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      });

      // Handle error setting session
      if (error) {
        console.error('[signIn] Error setting Supabase session:', error);
        setUser({ id: user.supabase_id, email: user.email } as any);
        setSession({ access_token: token.access_token } as any);
        return;
      }

      // Set user and session state
      setUser(data.user);
      setSession(data.session);

    } catch (error: any) {
      console.error('[signIn] Sign in error:', error);

      // Handle specific backend errors
      if (error.response?.status === 401) {
        throw new Error('Email ou senha inválidos');
      }
      if (error.response?.status === 403) {
        throw new Error('Usuário inativo. Entre em contato com o suporte.');
      }

      throw new Error(error.response?.data?.detail || error.message || 'Falha ao fazer login');
    
    // Finally block
    } finally {
      setLoading(false);
    }
  };


  // TODO: Sign in with Google (This version not working properly with backend session)
  const signInWithGoogle = async () => {
    try {
      // Start loading
      setLoading(true);

      // Redirect to Google OAuth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };


  // TODO: Sing out with Backend not with Supabase only
  //       but this version working, although this is a gambiarra
  // Sign out
  const signOut = async () => {
    try {

      // Start loading
      setLoading(true);

      // Call Supabase sign out
      const { error } = await supabase.auth.signOut();

      // Handle error signing out
      if (error) throw error;

      // Clear state
      setUser(null);
      setUserProfile(null);
      setSession(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };


  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    try {
      // Start loading
      setLoading(true);

      // Call backend update profile endpoint
      const updatedProfile = await api.auth.updateProfile(data);

      // Update profile in state
      setUserProfile(updatedProfile);
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };


  // Refresh user profile
  const refreshUserProfile = async () => {
    await fetchUserProfile();
  };


  // Initialize auth state
  useEffect(() => {

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
  
      // Set session and user
      setSession(session);
      
      // Set user from session
      setUser(session?.user ?? null);

      // User exists: fetch profile
      if (session?.user) {
        fetchUserProfile();
      }

      // Done loading
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {

      // Log auth state changes
      console.log('Auth state changed:', event, session);

      // Update session and user state
      setSession(session);
      setUser(session?.user ?? null);

      // Only fetch profile for OAuth logins (not manual signIn which already has profile)
      if (session?.user && (event === 'INITIAL_SESSION' || event === 'USER_UPDATED')) {

        // Fetch user profile
        await fetchUserProfile();

      // Signed out: clear profile
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }

      // Done loading
      setLoading(false);
    });

    return () => {

      // Unsubscribe from auth changes on unmount
      subscription.unsubscribe();
    };
  }, []);

  // Context value
  const value: AuthContextType = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateUserProfile,
    refreshUserProfile,
  };

  // Render provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
