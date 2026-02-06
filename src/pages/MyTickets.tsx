import React from 'react';
import { Download, Calendar, MapPin, QrCode } from 'lucide-react';

const MyTickets: React.FC = () => {
  // Mock tickets data
  const tickets = [
    {
      id: 1,
      orderNumber: 'TK-2024-001234',
      event: 'Kigali Music Festival 2024',
      date: '2024-12-15',
      time: '18:00',
      venue: 'BK Arena',
      category: 'VIP',
      seats: ['A12', 'A13'],
      status: 'confirmed',
      qrCode: 'QR123456789'
    },
    {
      id: 2,
      orderNumber: 'TK-2024-001235',
      event: 'Tech Conference Rwanda',
      date: '2024-12-20',
      time: '09:00',
      venue: 'Kigali Convention Centre',
      category: 'Regular',
      seats: ['B15'],
      status: 'confirmed',
      qrCode: 'QR987654321'
    }
  ];

  const handleDownloadTicket = (ticketId: number) => {
    alert(`Downloading ticket ${ticketId}...`);
  };

  const handleShowQR = (qrCode: string) => {
    alert(`QR Code: ${qrCode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-600 mt-2">Manage and view your purchased tickets</p>
        </div>
      </div>

      {/* Tickets List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets yet</h3>
            <p className="text-gray-600 mb-6">You haven't purchased any tickets yet.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map(ticket => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{ticket.event}</h3>
                      <p className="text-gray-600">Order #{ticket.orderNumber}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      ticket.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span>{new Date(ticket.date).toLocaleDateString()} at {ticket.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span>{ticket.venue}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">T</span>
                        <span>{ticket.category} - Seats: {ticket.seats.join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleDownloadTicket(ticket.id)}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Ticket
                      </button>
                      
                      <button
                        onClick={() => handleShowQR(ticket.qrCode)}
                        className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                        Show QR Code
                      </button>
                    </div>
                  </div>
                </div>

                {/* QR Code Preview */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold">Event Entry Instructions:</p>
                      <p>Present this QR code at the venue entrance for scanning.</p>
                    </div>
                    <div className="w-16 h-16 bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;