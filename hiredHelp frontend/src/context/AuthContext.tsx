import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await userApi.getMe();
      setUser(userData);
    } catch (error) {
      console.error(error);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: any) => {
    try {
      const data = await authApi.login(credentials);
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('userId', String(data.userId));
      localStorage.setItem('role', data.role);

      // Fetch full user profile now that the token is stored
      await loadUser();
      toast('Login successful', 'success');
    } catch (error) {
      toast('Invalid credentials', 'error');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setUser(null);
    toast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
