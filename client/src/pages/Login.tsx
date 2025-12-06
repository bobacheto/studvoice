import React from 'react';

/**
 * Login Page
 * TODO: Create form with email, password, schoolCode
 * TODO: Call auth.login() API
 * TODO: Store JWT token
 * TODO: Redirect to Dashboard on success
 */
export const Login: React.FC = () => {
  // TODO: useState for form fields (email, password, schoolCode)
  // TODO: useState for loading state
  // TODO: useState for error state
  // TODO: useNavigate hook for redirect
  // TODO: useAuth hook to update auth context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Validate form fields
    // TODO: Call auth.login()
    // TODO: Handle success/error
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Login to StudVoice</h1>
      {/* TODO: Create login form */}
      {/* TODO: Add email input */}
      {/* TODO: Add password input */}
      {/* TODO: Add schoolCode input */}
      {/* TODO: Add submit button */}
      {/* TODO: Add link to register page */}
    </div>
  );
};

export default Login;
