import React, { useState, useEffect, type ChangeEvent } from "react";

const TermsAndConditions: React.FC = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    const ticketData = localStorage.getItem('selected_ticket');
    if (ticketData) {
      setSelectedTicket(JSON.parse(ticketData));
    }
  }, []);

  // Explicitly type event
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setIsChecked(e.target.checked);
  };

  const handleContinue = (): void => {
    if (!isChecked) {
      alert("Please accept the terms and conditions to continue");
      return;
    }
    // Navigate to ticket booking system
    window.location.href = '/ticket-booking';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
          Terms And Conditions Apply
        </h1>

        {/* Selected Ticket Info */}
        {selectedTicket && (
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Selected Ticket</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Event:</span>
                <p className="font-medium">{selectedTicket.eventTitle}</p>
              </div>
              <div>
                <span className="text-gray-600">Ticket Type:</span>
                <p className="font-medium">{selectedTicket.ticketType}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600">Price:</span>
                <p className="font-medium text-blue-600 text-lg">RWF {parseInt(selectedTicket.price || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

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

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="text-lg font-semibold px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!isChecked}
            className={`text-lg font-bold px-12 py-3 rounded-xl transition-all duration-300 ${
              isChecked
                ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
            }`}
          >
            Continue to Seat Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
