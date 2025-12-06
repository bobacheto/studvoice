import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Polls from './pages/Polls';
import AMA from './pages/AMA';
import Challenges from './pages/Challenges';
import DirectorAnalytics from './pages/DirectorAnalytics';

/**
 * App Component
 * TODO: Set up routing
 * TODO: Implement protected routes for authenticated users
 * TODO: Redirect unauthenticated users to login
 */
export const App: React.FC = () => {
  // TODO: Create ProtectedRoute component for authenticated pages
  // TODO: Create RoleProtectedRoute component for role-specific pages

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/ama" element={<AMA />} />
          <Route path="/challenges" element={<Challenges />} />

          {/* Role-Protected Routes */}
          <Route path="/analytics" element={<DirectorAnalytics />} />

          {/* Redirect home to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
