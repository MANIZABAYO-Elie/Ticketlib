

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import InputField from '../components/InputField';

const TicketProceed: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    confirmEmail: ''
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    confirmEmail: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      fullName: '',
      email: '',
      confirmEmail: ''
    };

    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.confirmEmail.trim()) {
      newErrors.confirmEmail = 'Please confirm your email';
      isValid = false;
    } else if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = 'Emails do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Proceeding to checkout...');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-[#D9D9D9] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-center py-4 sm:py-6 relative">
            {/* Back Button */}
            <button
              className="absolute left-0 p-2 hover:bg-gray-200 rounded-full transition-colors"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>

            {/* Centered Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 text-center">
              Ticket Holder Info
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-start sm:items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700">
              Please provide your full name and email
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Full Name */}
            <div>
              <InputField
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600 px-2">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <InputField
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className='bg-gray-300'
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 px-2">{errors.email}</p>
              )}
            </div>

            {/* Confirm Email */}
            <div>
              <InputField
                type="email"
                name="confirmEmail"
                placeholder="Confirm Email"
                value={formData.confirmEmail}
                onChange={handleInputChange}
              />
              {errors.confirmEmail && (
                <p className="mt-2 text-sm text-red-600 px-2">{errors.confirmEmail}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8 sm:mt-12">
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-medium text-lg sm:text-xl px-12 sm:px-16 md:px-20 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Go To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketProceed;
