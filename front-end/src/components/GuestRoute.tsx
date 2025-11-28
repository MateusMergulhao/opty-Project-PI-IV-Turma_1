/**
 * GuestRoute Component
 * Protects routes that should only be accessible to non-authenticated users
 * Redirects to dashboard if user is already logged in
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';

interface GuestRouteProps {
  children: ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const { user, userProfile, loading } = useAuth();

  // Show loading state while checking auth or loading profile
  if (loading || (user && !userProfile)) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  // Redirect based on user role if already authenticated
  if (user && userProfile) {
    // Redirect supervisors to chat/supervisor, users to dashboard
    const redirectPath = userProfile.role === 'supervisor' ? '/chat/supervisor' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // Render children if not authenticated
  return <>{children}</>;
};

export default GuestRoute;
