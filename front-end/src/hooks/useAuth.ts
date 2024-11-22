import { useState, useEffect } from 'react';
import { authApi } from '../services/api';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  email: string;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token with backend or decode JWT to get user info
      const user = parseJwt(token); // Helper function to decode JWT
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    } else {
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await authApi.login(email, password);
      localStorage.setItem('token', response.access_token);
      const user = parseJwt(response.access_token);
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to login',
      }));
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await authApi.register(email, password);
      localStorage.setItem('token', response.access_token);
      const user = parseJwt(response.access_token);
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to register',
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      loading: false,
      error: null,
    });
  };

  // Helper function to decode JWT token
  const parseJwt = (token: string): User => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      const payload = JSON.parse(jsonPayload);
      return {
        id: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    register,
    logout,
  };
}
