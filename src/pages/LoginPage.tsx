import React from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import { Button } from "../components/Button";

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-800 to-blue-500 text-white text-center py-6 lg:py-8 rounded-t-xl">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">Sign in</h2>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
          {/* Profile Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-200 p-4 sm:p-5 lg:p-6 rounded-full">
              <FaUser className="text-gray-400 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            </div>
          </div>

          {/* Form */}
          <form>
            <div className="mb-4 sm:mb-5 lg:mb-6">
              <InputField
                type="text"
                placeholder="Enter full names"
                
              />
            </div>

            <div className="mb-4 sm:mb-5 lg:mb-6">
              <InputField
                type="password"
                placeholder="Enter password"
              />
            </div>

            <div className="flex justify-end mb-4 sm:mb-5 lg:mb-6">
              <a href="#" className="text-base sm:text-lg lg:text-xl text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-10 sm:h-12 md:h-14 border border-blue-400 bg-blue-500 text-white py-2 sm:py-3 lg:py-4 rounded-md hover:bg-white hover:text-blue-400 transition-colors text-base sm:text-lg lg:text-xl font-medium"
            >
              Sign in
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
