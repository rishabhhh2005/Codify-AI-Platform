import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Session expired'))))
      .then((data) => setUser(data.user))
      .catch(() => {
        setToken('');
        localStorage.removeItem('authToken');
      });
  }, [token]);

  const login = async (payload, mode) => {
    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      const error = new Error(data.error || 'Authentication failed');
      error.isUnverified = data.isUnverified;
      error.email = data.email;
      throw error;
    }
    
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const verifyOTP = async (email, otp) => {
    const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Verification failed');
    
    localStorage.setItem('authToken', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const resendOTP = async (email) => {
    const res = await fetch(`${API_URL}/api/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to resend OTP');
    return data;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const value = useMemo(() => ({ token, user, isAuthenticated: Boolean(token), login, logout, verifyOTP, resendOTP }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
