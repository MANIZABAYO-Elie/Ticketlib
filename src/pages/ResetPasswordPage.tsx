import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { ChevronLeft, Lock } from "lucide-react";
import InputField from "../components/InputField";
import { useResetPasswordMutation } from "../app/authApi";

const ResetPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";
  
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Validation
    if (!formData.newPassword || !formData.confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        email: email,
        otp_code: otp,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      }).unwrap();

      setSuccessMessage("Password reset successfully!");
      setTimeout(() => {
        navigate('/signIn');
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white text-center py-6 relative">
          <button 
            onClick={() => navigate('/signIn')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 hover:bg-blue-600 p-2 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl sm:text-2xl font-semibold">Reset Password</h2>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
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

          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Lock className="text-blue-600 w-8 h-8" />
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">
              Create a new password for your account
            </p>
            <p className="font-semibold text-gray-900">{email}</p>
          </div>

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <InputField
                type="password"
                name="newPassword"
                placeholder="Enter new password (min 6 characters)"
                value={formData.newPassword}
                onChange={handleChange}
                icon={<Lock size={18} />}
                required
              />
            </div>

            <div className="mb-6">
              <InputField
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={<Lock size={18} />}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white border-2 border-blue-500 py-3 rounded-lg hover:bg-white  hover:text-blue-500 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPasswordPage;