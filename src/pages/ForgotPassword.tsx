import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation } from '../app/authApi';

import InputField from '../components/InputField';
import { Button } from '../components/Button';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      await forgotPassword({ email }).unwrap();
      setMessage('OTP sent to your email successfully!');
      setTimeout(() => {
        navigate('/otp-verification', { state: { email } });
      }, 2000);
    } catch (err: any) {
      // Error is handled by RTK Query
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white text-center py-6 lg:py-8 rounded-t-xl">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">Forgot Password</h2>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {(error as any)?.data?.message || 'An error occurred'}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4 sm:mb-5 lg:mb-6">
              <InputField
                type="email"
                name="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-10 sm:h-12 md:h-14 border border-blue-400 bg-blue-500 text-white py-2 sm:py-3 lg:py-4 rounded-md hover:bg-white hover:text-blue-400 transition-colors text-base sm:text-lg lg:text-xl font-medium disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/signIn')}
              className="text-blue-600 hover:underline font-medium"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;