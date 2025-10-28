import React, { useState, type ChangeEvent } from "react";

const TermsAndConditions: React.FC = () => {
  // Explicitly type state as boolean
  const [isChecked, setIsChecked] = useState<boolean>(false);

  // Explicitly type event
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setIsChecked(e.target.checked);
  };

  const handleContinue = (): void => {
    if (!isChecked) {
      alert("Please accept the terms and conditions to continue");
      return;
    }
    console.log("Terms accepted, proceeding...");
    alert("Proceeding to next step...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
          Terms And Condition Apply
        </h1>

        {/* Content */}
        <div className="space-y-6 sm:space-y-8 text-gray-700">
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed">
            Before you proceed to purchase ticket, please read and acknowledge the below
          </p>

          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed">
            Terms and Conditions.
          </p>

          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed">
            Terms and condition may be found here:{" "}
            <a
              href="https://tklib.rw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
            >
              https://tklib.rw
            </a>
          </p>
        </div>

        {/* Checkbox */}
        <div className="mt-8 sm:mt-12 mb-8 sm:mb-10">
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-1">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded border-2 border-gray-400 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all duration-200"
              />
            </div>
            <span className="text-base sm:text-lg md:text-xl text-gray-600 group-hover:text-gray-800 transition-colors duration-200 select-none">
              I have read and agree to the terms and conditions
            </span>
          </label>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!isChecked}
            className={`text-xl sm:text-2xl md:text-3xl font-bold px-12 sm:px-16 md:px-20 py-3 sm:py-4 rounded-xl transition-all duration-300 transform ${
              isChecked
                ? "text-blue-600 hover:text-blue-700 hover:scale-105 active:scale-95 cursor-pointer"
                : "text-gray-400 cursor-not-allowed opacity-60"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
