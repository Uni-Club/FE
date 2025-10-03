'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from './api';

interface User {
  userId: number;
  email: string;
  name: string;
  phone?: string;
  studentId?: string;
  schoolId?: number;
  schoolName?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      setUser(response.user);
      // 미들웨어 인증 연계를 위한 쿠키 설정 (7일)
      if (response?.user?.userId) {
        const maxAge = 7 * 24 * 60 * 60; // 7d
        document.cookie = `user_id=${response.user.userId}; path=/; max-age=${maxAge}; samesite=lax`;
      }
      router.push('/search');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    // 쿠키 제거
    document.cookie = `user_id=; path=/; max-age=0; samesite=lax`;
    router.push('/login');
  };

  const signup = async (data: any) => {
    try {
      const response = await authAPI.signup(data);
      // After signup, automatically login
      await login(data.email, data.password);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
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
