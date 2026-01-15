import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireUser?: boolean;
}

export function ProtectedRoute({ children, requireAdmin, requireUser }: ProtectedRouteProps) {
  const { user, isAdmin, isLoading, role, isEmailVerified } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check email verification - redirect unverified users
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" state={{ email: user.email }} replace />;
  }

  // Admin routes: only accessible by admins
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // User-only routes: not accessible by admins
  if (requireUser && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Regular user routes: require authentication but not admin
  if (requireUser && role !== 'user') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
