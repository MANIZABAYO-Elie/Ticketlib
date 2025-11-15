import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import InputField from "../components/InputField";
import { Button } from "../components/Button";
import { useLoginMutation, useForgotPasswordMutation } from "../app/authApi";
import { login } from "../app/authSlice";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginMutation, { isLoading }] = useLoginMutation();
  const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await loginMutation({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // Dispatch login action to Redux store
      if (response.access_token) {
        dispatch(login({
          user: {
            id: response.user_id || response.id || '',
            email: response.email || formData.email,
            full_name: response.full_name || response.name || '',
          },
          token: response.access_token,
        }));
      }

      setSuccessMessage("Login successful!");
      setTimeout(() => {
        navigate('/logged-in-profile');
      }, 1000);
    } catch (error: any) {
      if (error?.status === 401 || error?.data?.detail?.includes('Invalid') || error?.data?.message?.includes('Invalid')) {
        setErrorMessage("Invalid credentials");
      } else {
        setErrorMessage(error?.data?.message || "Login failed");
      }
    }
  };

  const handleForgotPassword = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    
    if (!formData.email) {
      setErrorMessage("Please enter your email address first");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    try {
      console.log('Sending forgot password request for:', formData.email);
      const response = await forgotPassword({ email: formData.email }).unwrap();
      console.log('Forgot password response:', response);
      setSuccessMessage("OTP sent to your email address!");
      setTimeout(() => {
        navigate('/otp-verification', { state: { email: formData.email } });
      }, 1500);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      const errorMsg = error?.data?.message || error?.data?.detail || error?.message || "Failed to send OTP";
      setErrorMessage(errorMsg);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white text-center py-6 lg:py-8 rounded-t-xl">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">Sign in</h2>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          {/* Profile Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-200 p-4 sm:p-5 lg:p-6 rounded-full">
              <FaUser className="text-gray-400 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4 sm:mb-5 lg:mb-6">
              <InputField
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4 sm:mb-5 lg:mb-6">
              <InputField
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end mb-4 sm:mb-5 lg:mb-6">
              <Link
                to="/forgot-password"
                className="text-base sm:text-lg lg:text-xl text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 sm:h-12 md:h-14 border border-blue-400 bg-blue-500 text-white py-2 sm:py-3 lg:py-4 rounded-md hover:bg-white hover:text-blue-400 transition-colors text-base sm:text-lg lg:text-xl font-medium disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-6 sm:my-7 lg:my-8">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-2 sm:px-3 lg:px-4 text-base sm:text-lg lg:text-xl text-gray-400">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Create Account Button */}
          <Link to={'/signup'}>
                <Button className="w-full h-10 sm:h-12 md:h-14 border border-blue-400 text-white hover:text-blue-400 py-2 sm:py-3 lg:py-4 rounded-md hover:bg-blue-50 transition-colors text-base sm:text-lg lg:text-xl font-medium">
                    Create new account?
                </Button>
          </Link>   
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
