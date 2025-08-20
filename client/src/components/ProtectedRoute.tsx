import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect will happen via useEffect
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}