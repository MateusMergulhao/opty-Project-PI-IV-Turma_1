/**
 * RequireRole Component
 * Protects routes/components that require specific role
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

interface RequireRoleProps {
  children: ReactNode;
  role: 'user' | 'supervisor';
  redirectTo?: string;
}

export const RequireRole = ({ children, role, redirectTo = '/dashboard' }: RequireRoleProps) => {
  const { userProfile, loading } = useAuth();
  const { toast } = useToast();
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    // Only show toast if requiring supervisor role (users trying to access supervisor pages)
    // Don't show toast for supervisors being redirected away from user pages
    if (!loading && userProfile && userProfile.role !== role && !hasShownToast && role === 'supervisor') {
      toast({
        title: 'Acesso negado',
        description: 'Você precisa ter permissão de supervisor para acessar esta página.',
        variant: 'destructive',
      });
      setHasShownToast(true);
    }
  }, [loading, userProfile, role, hasShownToast, toast]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  // Redirect if user doesn't have required role
  if (!userProfile || userProfile.role !== role) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render children if user has required role
  return <>{children}</>;
};

export default RequireRole;
