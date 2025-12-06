import React from 'react';

/**
 * Register Page
 * TODO: Create form with email, password, confirmPassword, schoolCode
 * TODO: Call auth.register() API
 * TODO: Store JWT token
 * TODO: Redirect to Dashboard on success
 */
export const Register: React.FC = () => {
  // TODO: useState for form fields (email, password, confirmPassword, schoolCode)
  // TODO: useState for loading state
  // TODO: useState for error state
  // TODO: useNavigate hook for redirect
  // TODO: useAuth hook to update auth context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Validate form fields
    // TODO: Check password matches confirmPassword
    // TODO: Call auth.register()
    // TODO: Handle success/error
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Register to StudVoice</h1>
      {/* TODO: Create register form */}
      {/* TODO: Add email input */}
      {/* TODO: Add password input */}
      {/* TODO: Add confirmPassword input */}
      {/* TODO: Add schoolCode input */}
      {/* TODO: Add submit button */}
      {/* TODO: Add link to login page */}
    </div>
  );
};

export default Register;
