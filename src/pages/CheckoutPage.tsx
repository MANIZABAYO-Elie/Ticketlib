import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get cart data from localStorage or use default
  const getCartData = () => {
    // Check for new cart data structure first
    const cartData = localStorage.getItem('cart_data');
    if (cartData) {
      const orderData = JSON.parse(cartData);
      const subtotal = orderData.seatInfo.price;
      const serviceFee = Math.round(subtotal * 0.05);
      return {
        event: orderData.event,
        date: "December 20, 2024",
        venue: "Event Venue",
        category: orderData.seatInfo.ticketType,
        seats: [orderData.seatInfo.seatId],
        pricePerTicket: orderData.seatInfo.price,
        quantity: 1,
        subtotal: subtotal,
        serviceFee: serviceFee,
        total: subtotal + serviceFee,
        holderInfo: orderData.holderInfo
      };
    }
    
    // Fallback to old icyambu order structure
    const icyambuOrder = localStorage.getItem('icyambu_order');
    if (icyambuOrder) {
      const orderData = JSON.parse(icyambuOrder);
      return {
        event: orderData.event,
        date: "December 20, 2024",
        venue: "Kigali Convention Centre",
        category: orderData.ticketType,
        seats: orderData.seats.map((s: number) => `Seat ${s}`),
        pricePerTicket: orderData.pricePerTicket,
        quantity: orderData.seats.length,
        subtotal: orderData.total,
        serviceFee: Math.round(orderData.total * 0.05),
        total: orderData.total + Math.round(orderData.total * 0.05)
      };
    }
    
    // Default data
    return {
      event: "Sample Event",
      date: "December 20, 2024",
      venue: "Event Venue",
      category: "VIP",
      seats: ["Seat 1"],
      pricePerTicket: 50000,
      quantity: 1,
      subtotal: 50000,
      serviceFee: 2500,
      total: 52500
    };
  };
  
  const cartData = getCartData();

  const paymentMethods = [
    { id: 'mtn', name: 'MTN Mobile Money', icon: <Smartphone className="w-6 h-6" />, color: 'bg-yellow-500' },
    { id: 'airtel', name: 'Airtel Money', icon: <Smartphone className="w-6 h-6" />, color: 'bg-red-500' },
    { id: 'visa', name: 'Visa Card', icon: <CreditCard className="w-6 h-6" />, color: 'bg-blue-600' },
    { id: 'mastercard', name: 'Mastercard', icon: <CreditCard className="w-6 h-6" />, color: 'bg-red-600' }
  ];

  const handlePayment = async () => {
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to success page
      window.location.href = '/payment-success';
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{cartData.event}</h3>
                <p className="text-gray-600">{cartData.date}</p>
                <p className="text-gray-600">{cartData.venue}</p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span>{cartData.category} Tickets</span>
                  <span>x{cartData.quantity}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Seats: {cartData.seats.join(', ')}
                </div>
                {cartData.holderInfo && (
                  <div className="text-sm text-gray-600 mb-2">
                    Ticket Holder: {cartData.holderInfo.fullName}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Price per ticket:</span>
                  <span>RWF {cartData.pricePerTicket.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>RWF {cartData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span>RWF {cartData.serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>RWF {cartData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            
            <div className="space-y-3 mb-6">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full p-4 border-2 rounded-lg flex items-center gap-4 transition-all ${
                    selectedPayment === method.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-2 rounded ${method.color} text-white`}>
                    {method.icon}
                  </div>
                  <span className="font-medium">{method.name}</span>
                  <div className="ml-auto">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedPayment === method.id 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`} />
                  </div>
                </button>
              ))}
            </div>

            {selectedPayment && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Payment Instructions:</h3>
                {selectedPayment === 'mtn' && (
                  <p className="text-sm text-gray-600">
                    You will receive a prompt on your phone. Dial *182*7*1# to complete payment.
                  </p>
                )}
                {selectedPayment === 'airtel' && (
                  <p className="text-sm text-gray-600">
                    You will receive a prompt on your phone. Dial *175# to complete payment.
                  </p>
                )}
                {(selectedPayment === 'visa' || selectedPayment === 'mastercard') && (
                  <p className="text-sm text-gray-600">
                    You will be redirected to secure card payment page.
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={!selectedPayment || isProcessing}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
                selectedPayment && !isProcessing
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? 'Processing Payment...' : `Pay RWF ${cartData.total.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;