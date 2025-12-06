import React from 'react';

/**
 * NavBar Component
 * TODO: Display navigation menu
 * TODO: Show user role and profile
 * TODO: Add logout button
 * TODO: Show navigation links based on user role
 */
export const NavBar: React.FC = () => {
  // TODO: useAuth hook to get current user
  // TODO: useNavigate hook for routing
  // TODO: useState for mobile menu toggle

  const handleLogout = () => {
    // TODO: Call logout action
    // TODO: Clear JWT token
    // TODO: Redirect to login page
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">StudVoice</h1>
          {/* TODO: Add navigation links */}
          {/* TODO: Show Dashboard, Posts, Polls, AMA, Challenges links */}
          {/* TODO: Show Analytics link for DIRECTOR */}
          {/* TODO: Show Moderation link for MODERATOR */}
          {/* TODO: Add user profile dropdown */}
          {/* TODO: Add logout button */}
        </div>
      </div>
    </nav>
  );
};
