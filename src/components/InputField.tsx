import React from "react";

interface InputFieldProps {
  label?: string;
  type?: string;
  name?:string;
  placeholder: string;
  value?: string;
  className?:string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  name,
  placeholder,
  className,
  value,
  onChange,
  icon,
}) => {
  return (
    <div className="flex flex-col w-full mb-4">
      {label && <label className="text-sm font-medium mb-1">{label}</label>}
      <div className="flex items-center bg-gray-100 rounded-lg px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 border" style={{borderColor: '#D9D9D9'}}>
        {icon && <span className="text-gray-400 mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8">{icon}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`bg-transparent flex-1 outline-none text-base sm:text-lg lg:text-xl ${className || ''}`}
        />
      </div>
    </div>
  );
};

export default InputField;
