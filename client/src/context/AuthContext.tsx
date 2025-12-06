import React, { createContext, useState, useCallback } from 'react';

/**
 * AuthContext
 * TODO: Manage global auth state
 * TODO: Store user, isAuthenticated, JWT token
 * TODO: Provide login, logout, register functions
 */

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, schoolCode: string) => Promise<void>;
  register: (email: string, password: string, schoolCode: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: any) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider Component
 * TODO: Initialize auth state from localStorage
 * TODO: Implement login logic
 * TODO: Implement register logic
 * TODO: Implement logout logic
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email: string, password: string, schoolCode: string) => {
    try {
      // TODO: Call authAPI.login
      // TODO: Store JWT token in localStorage
      // TODO: Set user in state
      // TODO: Set isAuthenticated to true
    } catch (error) {
      // TODO: Handle error
      throw error;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, schoolCode: string) => {
    try {
      // TODO: Call authAPI.register
      // TODO: Store JWT token in localStorage
      // TODO: Set user in state
      // TODO: Set isAuthenticated to true
    } catch (error) {
      // TODO: Handle error
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // TODO: Call authAPI.logout
      // TODO: Clear JWT token from localStorage
      // TODO: Clear user state
      // TODO: Set isAuthenticated to false
    } catch (error) {
      // TODO: Handle error
      throw error;
    }
  }, []);

  // TODO: Initialize auth state from localStorage on component mount

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
