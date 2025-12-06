import React from 'react';
import { NavBar } from './NavBar';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout Component
 * TODO: Provide common structure for all dashboard pages
 * TODO: Include NavBar
 * TODO: Include sidebar or navigation menu
 * TODO: Include footer if needed
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      {/* TODO: Add footer if needed */}
    </div>
  );
};
