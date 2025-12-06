import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'DIRECTOR':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'TEACHER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'STUDENT_COUNCIL':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'MODERATOR':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'STUDENT':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <nav className="sticky top-0 bg-white dark:bg-gray-900 shadow z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            StudVoice
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/posts">Posts</NavLink>
          <NavLink to="/polls">Polls</NavLink>
          <NavLink to="/ama">AMA</NavLink>
          <NavLink to="/challenges">Challenges</NavLink>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-3">
          {user && (
            <>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                {user.role.replace('_', ' ')}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// NavLink component for navigation items
function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
    >
      {children}
    </Link>
  );
}
