import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-blue hover:bg-white",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-400 text-gray-800 hover:bg-gray-100",
  success:"bg-green-600 text-white font-semibold rounded-xl p-4 shadow-md hover:bg-green-700 transition"
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-2 sm:px-3 lg:px-4 py-1 sm:py-2 lg:py-2 text-base sm:text-lg lg:text-xl",
  md: "px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 text-base sm:text-lg lg:text-xl",
  lg: "px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-lg sm:text-xl lg:text-2xl",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}) => {
  const combinedClassName = `
    rounded-2xl font-medium transition duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    ${variantStyles[variant]} ${sizeStyles[size]} 
    ${disabled || isLoading ? "opacity-60 cursor-not-allowed" : ""} 
    ${className}
  `;

  return (
    <button
      disabled={disabled || isLoading}
      className={combinedClassName}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};
