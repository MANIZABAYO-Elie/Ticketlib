import React from 'react';
import { CheckCircle, Download, Calendar, Mail } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const getOrderData = () => {
    const icyambuOrder = localStorage.getItem('icyambu_order');
    if (icyambuOrder) {
      const orderData = JSON.parse(icyambuOrder);
      return {
        orderNumber: `TK-${Date.now()}`,
        event: orderData.event,
        date: 'December 20, 2024',
        venue: 'Kigali Convention Centre',
        seats: orderData.seats.map((s: number) => `Seat ${s}`),
        category: orderData.ticketType,
        total: orderData.total + Math.round(orderData.total * 0.05),
        email: orderData.customerInfo?.email || 'customer@example.com'
      };
    }
    return {
      orderNumber: `TK-${Date.now()}`,
      event: 'Icyambu 4th Edition',
      date: 'December 20, 2024',
      venue: 'Kigali Convention Centre',
      seats: ['Seat 1'],
      category: 'VIP',
      total: 52500,
      email: 'customer@example.com'
    };
  };
  
  const orderData = getOrderData();

  const handleDownloadTicket = () => {
    // Simulate ticket download
    alert('Ticket downloaded successfully!');
  };

  const handleAddToCalendar = () => {
    // Create calendar event
    const eventDate = new Date('2024-12-15T18:00:00');
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(orderData.event)}&dates=${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(`Venue: ${orderData.venue}\\nSeats: ${orderData.seats.join(', ')}`)}&location=${encodeURIComponent(orderData.venue)}`;
    window.open(calendarUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your tickets have been confirmed and sent to your email.</p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-semibold">{orderData.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Event:</span>
              <span className="font-semibold">{orderData.event}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold">{orderData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Venue:</span>
              <span className="font-semibold">{orderData.venue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-semibold">{orderData.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seats:</span>
              <span className="font-semibold">{orderData.seats.join(', ')}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Total Paid:</span>
              <span className="font-bold text-lg">RWF {orderData.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Email Confirmation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Email Confirmation Sent</span>
          </div>
          <p className="text-blue-700 text-sm">
            Your tickets have been sent to <strong>{orderData.email}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleDownloadTicket}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Tickets
          </button>

          <button
            onClick={handleAddToCalendar}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Add to Calendar
          </button>

          <button
            onClick={() => window.location.href = '/my-tickets'}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            View My Tickets
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Back to Homepage
          </button>
        </div>

        {/* QR Code Info */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Important Information</h3>
          <p className="text-yellow-700 text-sm">
            Please bring your digital ticket (with QR code) to the event entrance. 
            You can show it on your phone or print it out.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;