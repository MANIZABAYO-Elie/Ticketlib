import React, { useState } from "react";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import { Button } from "../components/Button";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useGetAllQuery } from "../features/countries/countriesApi";

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

  const countryOptions = countries.map((country) => country?.name?.common).filter(Boolean) as string[];

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
          <option key={country} value={country}>
            {country}
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
    country: "Rwanda",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // accept change from both input and select elements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // add validation / API call here
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
          <form onSubmit={handleSubmit}>
            <InputField
              placeholder="Enter full names"
              name="fullName"
              icon={<User size={18} />}
              value={formData.fullName}
              onChange={handleChange}
            />

            {/* pass the name so handleChange can pick it up */}
            <SelectField options={["Male", "Female", "Other"]} name="gender" value={formData.gender} onChange={handleChange} />

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
              placeholder="Enter strong password"
              name="password"
              icon={<Lock size={18} />}
              value={formData.password}
              onChange={handleChange}
            />

            <InputField
              type="password"
              placeholder="Repeat password"
              name="confirmPassword"
              icon={<Lock size={18} />}
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <div className="mt-6 sm:mt-7 lg:mt-8">
              <Button className="w-full h-10 sm:h-12 md:h-14 bg-blue-500 text-white py-2 sm:py-3 lg:py-4 rounded-md  transition-colors hover:bg-white hover:text-blue-400 sm:text-lg lg:text-xl font-medium">
                Create account
              </Button>
            </div>

            <div className="mt-4 sm:mt-5 lg:mt-6 text-center">
              <button
                type="button"
                className="text-blue-600 text-base sm:text-lg lg:text-xl hover:underline"
                onClick={() => console.log("Back to login")}
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
