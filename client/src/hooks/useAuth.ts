import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth Hook
 * TODO: Provide access to auth context
 * TODO: Return user, isAuthenticated, login, logout, loading
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  // TODO: Return auth context values (user, isAuthenticated, login, logout, loading)
  return context;
};
