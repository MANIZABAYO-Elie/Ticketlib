import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import { Button } from "../components/Button";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useGetAllQuery } from "../features/countries/countriesApi";
import { useRegisterMutation } from "../app/authApi";

interface CountrySelectFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const CountrySelectField: React.FC<CountrySelectFieldProps> = ({ value, onChange }) => {
  // typed loosely here — replace `any` with proper country type if available
  const { data: countries, isLoading, error } = useGetAllQuery<any[]>();

  if (isLoading) {
    return <SelectField options={["Loading..."]} value={value} onChange={onChange} name="country" />;
  }

  if (error || !countries || countries.length === 0) {
    return <SelectField options={["Rwanda"]} value={value} onChange={onChange} name="country" />;
  }

  const countryOptions = countries.map((country) => ({
    name: country?.name?.common,
    code: country?.cca2
  })).filter(item => item.name && item.code);

  return (
    <div className="flex flex-col w-full mb-4">
      <select
        name="country"
        value={value}
        onChange={onChange}
        className="bg-gray-100 rounded-lg px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 border outline-none text-base sm:text-lg lg:text-xl"
        style={{ borderColor: "#D9D9D9" }}
      >
        <option value="">Select Country</option>
        {countryOptions.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    country: "RW",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  // accept change from both input and select elements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setErrorMessage("Full name is required");
      return false;
    }
    if (!formData.gender) {
      setErrorMessage("Gender is required");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setErrorMessage("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }
    if (!formData.country) {
      setErrorMessage("Country is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        phone: formData.phone,
        your_country: formData.country,
        gender: formData.gender,
      }).unwrap();

      setSuccessMessage("Account created successfully! Please check your email to verify your account.");
      setFormData({
        fullName: "",
        gender: "",
        dob: "",
        country: "RW",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setErrorMessage(error?.data?.message || "Failed to create account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-800 to-blue-500 text-white text-center py-6 lg:py-8 rounded-t-xl">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">Create account</h2>
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
          <form onSubmit={handleSubmit}>
            <InputField
              placeholder="Enter full names"
              name="fullName"
              icon={<User size={18} />}
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            {/* pass the name so handleChange can pick it up */}
            <SelectField options={["male", "female", "other"]} name="gender" value={formData.gender} onChange={handleChange} />

            <InputField
              type="date"
              placeholder="Select your date of birth"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />

            <CountrySelectField value={formData.country} onChange={handleChange} />

            <InputField
              type="email"
              placeholder="Enter email address"
              name="email"
              icon={<Mail size={18} />}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputField
              type="tel"
              placeholder="Phone number (optional)"
              name="phone"
              icon={<Phone size={18} />}
              value={formData.phone}
              onChange={handleChange}
            />

            <InputField
              type="password"
              placeholder="Enter strong password (min 6 characters)"
              name="password"
              icon={<Lock size={18} />}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <InputField
              type="password"
              placeholder="Repeat password"
              name="confirmPassword"
              icon={<Lock size={18} />}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="mt-6 sm:mt-7 lg:mt-8">
              <Button 
                disabled={isLoading}
                className="w-full h-10 sm:h-12 md:h-14 bg-blue-500 text-white py-2 sm:py-3 lg:py-4 rounded-md transition-colors hover:bg-white hover:text-blue-400 sm:text-lg lg:text-xl font-medium disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </div>

            <div className="mt-4 sm:mt-5 lg:mt-6 text-center">
              <button
                type="button"
                className="text-blue-600 text-base sm:text-lg lg:text-xl hover:underline"
                onClick={() => navigate("/signIn")}
              >
                Back to login?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
