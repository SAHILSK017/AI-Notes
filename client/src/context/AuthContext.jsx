'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../lib/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkUser = useCallback(async () => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
      }
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (error) {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.data.data.token);
      }
      setUser(res.data.data);
      router.push('/dashboard');
    }
    return res.data;
  };

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.data.data.token);
      }
      setUser(res.data.data);
      router.push('/dashboard');
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout errors
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    router.push('/login');
  };

  // Protect routes based on path
  useEffect(() => {
    if (!loading) {
      const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
      const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/notes');

      if (!user && isProtectedRoute) {
        router.push('/login');
      }
      if (user && isAuthRoute) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
