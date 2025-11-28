/**
 * useAuth hook
 * Custom hook to access authentication context
 */

/**
 * IMPORTS
 */
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext.t';


/**
 * EXPORTS
 */
export const useAuth = (): AuthContextType => {

  // Get context
  const context = useContext(AuthContext);

  // Context not found: throw error
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Return context
  return context;
};
