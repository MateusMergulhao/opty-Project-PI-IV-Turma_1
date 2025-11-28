/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to='/login' replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
