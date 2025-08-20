import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not logged in, redirect to login
        setLocation('/login');
      } else if (user?.role !== 'admin') {
        // Logged in but not admin, redirect to home
        setLocation('/');
      }
    }
  }, [isAuthenticated, isLoading, user, setLocation]);

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

  // If not authenticated or not admin, redirect will happen via useEffect
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Ruxsat yo'q</h1>
          <p className="text-gray-600">Bu sahifaga faqat administratorlar kira oladi.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}