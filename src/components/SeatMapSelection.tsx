import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin } from 'lucide-react';

interface SeatMapSelectionProps {
  eventTitle: string;
  ticketType: string;
  price: number;
  onBack: () => void;
  onAddToCart: (seatInfo: any, holderInfo: any) => void;
}

interface TicketHolderInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

const SeatMapSelection: React.FC<SeatMapSelectionProps> = ({
  eventTitle,
  ticketType,
  price,
  onBack,
  onAddToCart
}) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketHolderInfo, setTicketHolderInfo] = useState<TicketHolderInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  // Generate seat map sections
  const sections = [
    { id: 'VIP', name: 'VIP Section', color: 'bg-purple-600', available: true },
    { id: 'REGULAR', name: 'Regular Section', color: 'bg-blue-600', available: true },
    { id: 'VVIP', name: 'VVIP Section', color: 'bg-gold-600', available: true }
  ];

  // Generate seats for selected section - all available
  const generateSeats = (section: string) => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E'];
    for (let row of rows) {
      for (let i = 1; i <= 10; i++) {
        seats.push({
          id: `${section}-${row}${i}`,
          row,
          number: i,
          status: 'available'
        });
      }
    }
    return seats;
  };

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId);
    setSelectedSeat(null);
  };

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
  };

  const handleInputChange = (field: keyof TicketHolderInfo, value: string) => {
    setTicketHolderInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddToCart = () => {
    if (!selectedSeat || !ticketHolderInfo.fullName || !ticketHolderInfo.email) {
      alert('Please fill in all required fields');
      return;
    }

    const seatInfo = {
      seatId: selectedSeat,
      section: selectedSection,
      ticketType,
      price
    };

    onAddToCart(seatInfo, ticketHolderInfo);
  };

  const isFormValid = ticketHolderInfo.fullName && ticketHolderInfo.email && ticketHolderInfo.phone;

  if (showTicketForm && selectedSeat) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setShowTicketForm(false)}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Seat Selection
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Ticket Holder Information</h2>
            
            {/* Selected Seat Info */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Selected Seat Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Event:</span>
                  <p className="font-medium">{eventTitle}</p>
                </div>
                <div>
                  <span className="text-gray-600">Ticket Type:</span>
                  <p className="font-medium">{ticketType}</p>
                </div>
                <div>
                  <span className="text-gray-600">Seat:</span>
                  <p className="font-medium">{selectedSeat}</p>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <p className="font-medium text-blue-600">RWF {price.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Ticket Holder Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={ticketHolderInfo.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={ticketHolderInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={ticketHolderInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address (Optional)
                </label>
                <textarea
                  value={ticketHolderInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter address"
                  rows={3}
                />
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!isFormValid}
              className={`w-full mt-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
                isFormValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Add to Cart - RWF {price.toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedSection) {
    const seats = generateSeats(selectedSection);
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSelectedSection(null)}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Sections
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              Select Your Seat - {sections.find(s => s.id === selectedSection)?.name}
            </h2>

            {/* Seat Grid */}
            <div className="mb-8">
              <div className="grid grid-cols-10 gap-2 max-w-2xl mx-auto">
                {seats.map(seat => (
                  <button
                    key={seat.id}
                    onClick={() => seat.status === 'available' && handleSeatSelect(seat.id)}
                    disabled={seat.status === 'unavailable'}
                    className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                      selectedSeat === seat.id
                        ? 'bg-green-500 text-white'
                        : seat.status === 'available'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    title={`Seat ${seat.row}${seat.number}`}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button - only show when seat is selected */}
            {selectedSeat && (
              <div className="text-center">
                <button
                  onClick={() => {
                    const seatInfo = {
                      seatId: selectedSeat,
                      section: selectedSection,
                      ticketType,
                      price
                    };
                    onAddToCart(seatInfo, null);
                  }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue to Ticket Info - RWF {price.toLocaleString()}
                </button>
              </div>
            )}

            {/* Legend */}
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Select Section</h2>
          <p className="text-center text-gray-600 mb-8">
            Event: {eventTitle} | Ticket Type: {ticketType}
          </p>

          {/* Venue Map */}
          <div className="relative bg-gray-100 rounded-2xl p-8 mb-8">
            {/* Stage */}
            <div className="flex justify-center mb-8">
              <div className="bg-amber-200 px-8 py-4 rounded-lg">
                <span className="text-lg font-bold">STAGE</span>
              </div>
            </div>

            {/* Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => handleSectionSelect(section.id)}
                  className={`${section.color} text-white p-6 rounded-lg hover:opacity-90 transition-opacity`}
                >
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-2">{section.name}</h3>
                    <p className="text-sm opacity-90">Click to view seats</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="text-center text-sm text-gray-600">
            <p>Select a section to view available seats</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatMapSelection;