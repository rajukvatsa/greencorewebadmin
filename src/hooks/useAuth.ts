import { useState, useEffect } from 'react';
import { AuthenticatedUser } from '@/middleware/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const hasPermission = (feature: string, action: string): boolean => {
    if (!user || !user.permissions) return false;
    const featurePermissions = user.permissions[feature];
    if (!featurePermissions) return false;
    return featurePermissions[action as keyof typeof featurePermissions] || false;
  };

  return { user, loading, hasPermission };
}