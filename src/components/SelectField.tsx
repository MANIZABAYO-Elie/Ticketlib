import React from "react";

interface SelectFieldProps {
  label?: string;
  options: string[];
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, options, value, name, onChange }) => {
  return (
    <div className="flex flex-col w-full mb-4">
      {label && <label className="text-base sm:text-lg lg:text-xl font-medium mb-1">{label}</label>}
      <div className="bg-gray-100 rounded-lg px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 border" style={{borderColor: '#D9D9D9'}}>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="bg-transparent w-full outline-none text-base sm:text-lg lg:text-xl"
        >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
        </select>
      </div>
    </div>
  );
};

export default SelectField;
