import React, { useState } from 'react';
import { CreditCard, Smartphone, Wallet, ChevronDown } from 'lucide-react';
import { Button } from '../components/Button';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const PaymentConfirmation: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'Pay securely with your card'
    },
    {
      id: 'momo',
      name: 'Mobile Money',
      icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'MTN, Airtel Money'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'PayPal, Stripe'
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setIsDropdownOpen(false);
  };

  const handleProceed = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    console.log('Processing payment with method:', selectedMethod);
    alert(`Processing payment with ${paymentMethods.find(m => m.id === selectedMethod)?.name}`);
  };

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 text-center">
              Payment
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-start sm:items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-3xl">
          {/* Confirm Payment Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-600 font-medium">
              Confirm Payment
            </h2>
          </div>

          {/* Amount Display */}
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 font-normal">
              Actual Amount: <span className="font-semibold">20,000 rwf</span>
            </p>
          </div>

          {/* Payment Method Selector */}
          <div className="mb-8 sm:mb-12">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-6 py-5 sm:py-6 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between hover:border-gray-300 transition-all duration-200"
              >
                <span className="text-base sm:text-lg md:text-xl text-gray-500">
                  {selectedMethodData ? (
                    <div className="flex items-center gap-3">
                      <div className="text-gray-700">{selectedMethodData.icon}</div>
                      <span className="text-gray-800">{selectedMethodData.name}</span>
                    </div>
                  ) : (
                    'Choose from Above Method of Payment'
                  )}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-10">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method.id)}
                      className={`w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors duration-150 ${
                        selectedMethod === method.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className={`${selectedMethod === method.id ? 'text-blue-600' : 'text-gray-700'}`}>
                        {method.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-base sm:text-lg font-medium ${
                          selectedMethod === method.id ? 'text-blue-600' : 'text-gray-800'
                        }`}>
                          {method.name}
                        </p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Details Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8 sm:mb-12">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600 text-base sm:text-lg">Subtotal</span>
                <span className="text-gray-800 font-medium text-base sm:text-lg">20,000 rwf</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600 text-base sm:text-lg">Service Fee</span>
                <span className="text-gray-800 font-medium text-base sm:text-lg">0 rwf</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-800 font-semibold text-lg sm:text-xl">Total</span>
                <span className="text-gray-900 font-bold text-xl sm:text-2xl">20,000 rwf</span>
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleProceed}
              variant='success'
              className=" text-white font-medium text-lg sm:text-xl px-16 sm:px-20 md:px-24 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={!selectedMethod}
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;