import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { ChevronLeft, Mail } from "lucide-react";
import { useForgotPasswordMutation, useResetPasswordMutation } from "../app/authApi";
import { Lock } from "lucide-react";
import InputField from "../components/InputField";

const OtpVerificationPage: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({ new_password: "", confirm_password: "" });
  const [step, setStep] = useState(1); // 1: OTP, 2: Password
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [canResend, setCanResend] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit OTP");
      return;
    }

    setStep(2);
    setSuccessMessage("OTP verified! Now set your new password.");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (passwords.new_password !== passwords.confirm_password) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (passwords.new_password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    try {
      await resetPassword({
        email,
        otp_code: otp.join(""),
        new_password: passwords.new_password,
        confirm_password: passwords.confirm_password,
      }).unwrap();
      setSuccessMessage("Password reset successfully!");
      setTimeout(() => {
        navigate('/signIn');
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error?.data?.message || "Failed to reset password");
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      await forgotPassword({ email }).unwrap();
      setSuccessMessage("New OTP sent to your email!");
      setTimeLeft(600);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (error: any) {
      setErrorMessage(error?.data?.message || "Failed to resend OTP");
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
          <h2 className="text-xl sm:text-2xl font-semibold">{step === 1 ? "Verify OTP" : "Reset Password"}</h2>
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

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              {step === 1 ? <Mail className="text-blue-600 w-8 h-8" /> : <Lock className="text-blue-600 w-8 h-8" />}
            </div>
          </div>

          <div className="text-center mb-6">
            {step === 1 ? (
              <>
                <p className="text-gray-600 mb-2">
                  We've sent a 6-digit verification code to
                </p>
                <p className="font-semibold text-gray-900">{email}</p>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-2">
                  Create a new password for your account
                </p>
                <p className="font-semibold text-gray-900">{email}</p>
              </>
            )}
          </div>

          {step === 1 ? (
            /* OTP Form */
            <form onSubmit={handleOtpSubmit}>
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                ))}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                "Continue"
              </Button>
            </form>
          ) : (
            /* Password Form */
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <InputField
                  type="password"
                  name="new_password"
                  placeholder="Enter new password (min 6 characters)"
                  value={passwords.new_password}
                  onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
                  icon={<Lock size={18} />}
                  required
                />
              </div>

              <div className="mb-6">
                <InputField
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm new password"
                  value={passwords.confirm_password}
                  onChange={(e) => setPasswords({...passwords, confirm_password: e.target.value})}
                  icon={<Lock size={18} />}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}

          {step === 1 && (
            /* Resend OTP */
            <div className="text-center mt-6">
              {!canResend ? (
                <p className="text-gray-600">
                  Resend OTP in <span className="font-semibold text-blue-600">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-blue-600 hover:underline font-medium disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;