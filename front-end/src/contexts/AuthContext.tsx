import React, { createContext, useContext } from "react";
import { useAuth, AuthState } from "../hooks/useAuth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, error, login, register, logout } = useAuth();

  const authValue: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
