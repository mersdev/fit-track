import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
}
