'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, userApi } from '@/lib/api';

interface User {
  userId: number;
  email: string;
  name: string;
  role: string;
  school?: {
    schoolId: number;
    schoolName: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'token';
const REMEMBER_KEY = 'rememberLogin';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getStorage = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const remember = localStorage.getItem(REMEMBER_KEY) === 'true';
    return remember ? localStorage : sessionStorage;
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    setUser(null);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      // Check both storages for token
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await userApi.getMe();

      if (response.success && response.data) {
        setUser(response.data as User);
      } else {
        // Token invalid or expired
        clearAuth();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Auto logout on 401 response
  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuth();
      router.push('/auth/login');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [clearAuth, router]);

  const login = async (email: string, password: string, remember: boolean = false) => {
    const response = await authApi.login(email, password);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || '로그인에 실패했습니다.');
    }

    const { token, user: userData } = response.data;

    // Store remember preference
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, 'true');
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
      sessionStorage.setItem(TOKEN_KEY, token);
    }

    setUser(userData as User);
    router.push('/');
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      clearAuth();
      router.push('/auth/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
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
