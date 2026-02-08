import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export type UserRole = 'ADMIN' | 'INTERNAL' | 'CUSTOMER';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (googleData: { email: string; name: string; avatar?: string; googleId: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('subscriptiq_token');
      const savedUser = localStorage.getItem('subscriptiq_user');

      if (token && savedUser) {
        try {
          // Verify token is still valid
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('subscriptiq_token');
          localStorage.removeItem('subscriptiq_user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    try {
      const { data } = await api.post('/auth/login', { email, password, role });

      setUser(data.user);
      localStorage.setItem('subscriptiq_token', data.token);
      localStorage.setItem('subscriptiq_user', JSON.stringify(data.user));

      toast.success('Welcome back!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });

      setUser(data.user);
      localStorage.setItem('subscriptiq_token', data.token);
      localStorage.setItem('subscriptiq_user', JSON.stringify(data.user));

      toast.success('Account created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const googleLogin = async (googleData: { email: string; name: string; avatar?: string; googleId: string }) => {
    try {
      const { data } = await api.post('/auth/google', googleData);

      setUser(data.user);
      localStorage.setItem('subscriptiq_token', data.token);
      localStorage.setItem('subscriptiq_user', JSON.stringify(data.user));

      toast.success('Welcome!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Google login failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('subscriptiq_token');
    localStorage.removeItem('subscriptiq_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, register, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
