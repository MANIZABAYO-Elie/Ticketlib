import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Info } from 'lucide-react';
import SeatMapSelection from '../components/SeatMapSelection';

// Ticketing System Types
export type CategoryName = 'Regular' | 'VIP' | 'VVIP';

export interface Category {
  id: number;
  name: CategoryName;
  price: number;
  available: boolean;
  color: string;
}

export interface BlockCategory {
  block: string;
  category: CategoryName;
  seatsPerBlock: number;
}

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'unavailable';
}

const TicketBookingSystem: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showSeatMap, setShowSeatMap] = useState(false);
  
  // Get selected ticket data from localStorage
  const selectedTicket = JSON.parse(localStorage.getItem('selected_ticket') || '{}');
  const [quantity, setQuantity] = useState(1);
  
  // Don't auto-select category - let user choose after terms

  // Categories with exact pricing
  const categories: Category[] = [
    { id: 1, name: 'Regular', price: 5000, available: true, color: 'teal' },
    { id: 2, name: 'VIP', price: 30000, available: true, color: 'blue' },
    { id: 3, name: 'VVIP', price: 60000, available: true, color: 'red' }
  ];

  // Block assignments with exact seat totals
  const blockCategories: BlockCategory[] = [
    // Regular blocks - 5,000 total seats
    { block: 'A1', category: 'Regular', seatsPerBlock: 500 },
    { block: 'A2', category: 'Regular', seatsPerBlock: 500 },
    { block: 'A3', category: 'Regular', seatsPerBlock: 500 },
    { block: 'B1', category: 'Regular', seatsPerBlock: 600 },
    { block: 'B2', category: 'Regular', seatsPerBlock: 600 },
    { block: 'B3', category: 'Regular', seatsPerBlock: 600 },
    { block: 'C1', category: 'Regular', seatsPerBlock: 400 },
    { block: 'C2', category: 'Regular', seatsPerBlock: 400 },
    { block: 'C3', category: 'Regular', seatsPerBlock: 400 },
    { block: 'D1', category: 'Regular', seatsPerBlock: 300 },
    { block: 'D2', category: 'Regular', seatsPerBlock: 300 },
    { block: 'D3', category: 'Regular', seatsPerBlock: 300 },
    { block: 'E1', category: 'Regular', seatsPerBlock: 200 },
    { block: 'E2', category: 'Regular', seatsPerBlock: 200 },
    { block: 'E3', category: 'Regular', seatsPerBlock: 200 },
    { block: 'STANDING1', category: 'Regular', seatsPerBlock: 0 },

    // VIP blocks - 3,000 total seats
    { block: 'VIP1', category: 'VIP', seatsPerBlock: 400 },
    { block: 'VIP2', category: 'VIP', seatsPerBlock: 400 },
    { block: 'VIP3', category: 'VIP', seatsPerBlock: 400 },
    { block: 'VIP4', category: 'VIP', seatsPerBlock: 350 },
    { block: 'VIP5', category: 'VIP', seatsPerBlock: 350 },
    { block: 'VIP6', category: 'VIP', seatsPerBlock: 350 },
    { block: 'VIP7', category: 'VIP', seatsPerBlock: 250 },
    { block: 'VIP8', category: 'VIP', seatsPerBlock: 250 },
    { block: 'VIP9', category: 'VIP', seatsPerBlock: 250 },
    { block: 'VIP_PREMIUM', category: 'VIP', seatsPerBlock: 0 },

    // VVIP blocks - 2,000 total seats
    { block: 'VVIP1', category: 'VVIP', seatsPerBlock: 300 },
    { block: 'VVIP2', category: 'VVIP', seatsPerBlock: 300 },
    { block: 'VVIP3', category: 'VVIP', seatsPerBlock: 300 },
    { block: 'VVIP4', category: 'VVIP', seatsPerBlock: 250 },
    { block: 'VVIP5', category: 'VVIP', seatsPerBlock: 250 },
    { block: 'VVIP6', category: 'VVIP', seatsPerBlock: 200 },
    { block: 'VVIP7', category: 'VVIP', seatsPerBlock: 200 },
    { block: 'VVIP8', category: 'VVIP', seatsPerBlock: 200 },
    { block: 'VVIP_SUITE', category: 'VVIP', seatsPerBlock: 0 }
  ];

  // Helper functions
  const getCategoryTotals = (): Record<CategoryName, number> => {
    const totals: Record<CategoryName, number> = { Regular: 0, VIP: 0, VVIP: 0 };
    blockCategories.forEach(bc => {
      totals[bc.category] += bc.seatsPerBlock;
    });
    return totals;
  };

  const getBlocksByCategory = (category: CategoryName): BlockCategory[] => {
    return blockCategories.filter(bc => bc.category === category);
  };

  const getTotalSeats = (): number => {
    return blockCategories.reduce((sum, bc) => sum + bc.seatsPerBlock, 0);
  };

  // Get category totals for display
  const categoryTotals = getCategoryTotals();

  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    // Generate 20 seats - all available
    for (let i = 1; i <= 20; i++) {
      seats.push({
        id: `S${i}`,
        row: 'S',
        number: i,
        status: 'available'
      });
    }
    return seats;
  };

  const [seats] = useState<Seat[]>(generateSeats());

  const handleSeatClick = (seatId: string): void => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.status === 'unavailable') return;

    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleCategorySelect = (category: Category): void => {
    if (category.available) {
      setSelectedCategory(category);
      setShowSeatMap(true);
    }
  };

  const handleBlockSelect = (block: string): void => {
    if (selectedCategory) {
      setSelectedBlock(block);
    }
  };

  const totalPrice: number = selectedSeats.length * (selectedCategory?.price || 0);

  const handleAddToCart = (seatInfo: any, holderInfo: any) => {
    // Store seat selection data for ticket-proceed page
    localStorage.setItem('seat_selection', JSON.stringify(seatInfo));
    navigate('/ticket-proceed');
  };

  if (showSeatMap && selectedCategory) {
    return (
      <SeatMapSelection
        eventTitle={selectedTicket.eventTitle || 'Event'}
        ticketType={selectedCategory.name}
        price={selectedCategory.price}
        onBack={() => setShowSeatMap(false)}
        onAddToCart={handleAddToCart}
      />
    );
  }



  if (selectedBlock && selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => setSelectedBlock(null)}
            className="mb-4 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 flex items-center gap-2"
          >
            ← Back
          </button>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-2">Select seat in this block</h2>
            <p className="text-gray-500 text-center mb-6">Please select any seat you want in this section to continue.</p>
            
            <div className="mb-6">
              <p className="text-center text-gray-600 mb-4">ICYAMBU 4TH EDITION - VIP SEATING</p>
              <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
                {seats.map(seat => (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat.id)}
                    disabled={seat.status === 'unavailable'}
                    className={`w-12 h-12 rounded-lg font-semibold transition-colors ${
                      selectedSeats.includes(seat.id)
                        ? 'bg-green-500 text-white'
                        : seat.status === 'unavailable'
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    title={`Seat ${seat.number}`}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-6 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span>Sold out</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Selected</span>
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm mb-6">The overview from top.</p>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Ticket className="text-gray-600" />
                <span className="font-semibold">{selectedCategory.name} category</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{totalPrice.toLocaleString()} RWF</div>
                <div className="text-sm text-gray-500">{selectedSeats.length} seat(s) selected</div>
              </div>
            </div>

            {selectedSeats.length > 0 && (
              <button 
                onClick={() => {
                  // Store Icyambu selection data
                  localStorage.setItem('icyambu_selection', JSON.stringify({
                    event: selectedTicket.eventTitle || 'Event',
                    eventId: selectedTicket.eventId,
                    seats: selectedSeats.map(id => parseInt(id.replace('S', ''))),
                    ticketType: selectedCategory?.name || selectedTicket.ticketType,
                    pricePerTicket: selectedCategory?.price || ticketPrice,
                    total: selectedSeats.length * (selectedCategory?.price || ticketPrice)
                  }));
                  navigate('/ticket-proceed');
                }}
                className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venue Map */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Venue Layout</h2>
          
          <div className="relative bg-gray-100 rounded-2xl p-8">
            {/* VVIP Level */}
            <div className="mb-6">
              <h3 className="text-center text-sm font-bold text-red-600 mb-2">VVIP Section</h3>
              <div className="flex justify-center gap-2 flex-wrap">
                {getBlocksByCategory('VVIP').map(block => (
                  <button
                    key={block.block}
                    onClick={() => handleBlockSelect(block.block)}
                    className="w-16 h-12 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition-colors"
                    title={`${block.seatsPerBlock} seats`}
                  >
                    {block.block}
                  </button>
                ))}
              </div>
            </div>

            {/* VIP Level */}
            <div className="mb-6">
              <h3 className="text-center text-sm font-bold text-blue-600 mb-2">VIP Section</h3>
              <div className="flex justify-center gap-2 flex-wrap">
                {getBlocksByCategory('VIP').map(block => (
                  <button
                    key={block.block}
                    onClick={() => handleBlockSelect(block.block)}
                    className="w-16 h-12 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
                    title={`${block.seatsPerBlock} seats`}
                  >
                    {block.block}
                  </button>
                ))}
              </div>
            </div>

            {/* Stage */}
            <div className="flex justify-center mb-6">
              <div className="w-96 h-24 bg-amber-200 rounded flex items-center justify-center">
                <span className="text-lg font-bold">STAGE</span>
              </div>
            </div>

            {/* Regular Level */}
            <div className="mb-6">
              <h3 className="text-center text-sm font-bold text-teal-600 mb-2">Regular Section</h3>
              <div className="grid grid-cols-8 gap-2 max-w-4xl mx-auto">
                {getBlocksByCategory('Regular').map(block => (
                  <button
                    key={block.block}
                    onClick={() => handleBlockSelect(block.block)}
                    className={`h-12 rounded text-xs font-semibold transition-colors ${
                      block.seatsPerBlock === 0 
                        ? 'bg-teal-300 text-teal-800 hover:bg-teal-400'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                    title={`${block.seatsPerBlock} seats`}
                  >
                    {block.block}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span>VVIP (RWF 60,000)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>VIP (RWF 30,000)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-teal-600 rounded"></div>
                <span>Regular (RWF 5,000)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-teal-300 rounded"></div>
                <span>Standing/Premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Categories */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">{selectedTicket.eventTitle || 'Event Tickets'}</h2>
          <p className="text-sm text-gray-500 mb-2">Select your preferred seating category</p>
          <p className="text-xs text-gray-400 mb-6">Total Seats: {getTotalSeats().toLocaleString()}</p>
          
          <div className="space-y-3">
            {categories.map(category => {
              const categoryTotal = categoryTotals[category.name];
              const colorClass = category.color === 'teal' ? 'text-teal-500' : 
                               category.color === 'blue' ? 'text-blue-600' : 'text-red-600';
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  disabled={!category.available}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedCategory?.id === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : category.available
                      ? 'border-gray-200 hover:border-blue-300'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Ticket className={colorClass} />
                      <div className="text-left">
                        <div className="font-bold">{category.name}</div>
                        <div className="text-sm text-gray-600">RWF {category.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{categoryTotal.toLocaleString()} seats</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!category.available && (
                        <span className="bg-red-400 text-white text-xs px-3 py-1 rounded">SOLD OUT</span>
                      )}
                      <Info className="text-gray-400" size={20} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedCategory && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-semibold">
                Selected: {selectedCategory.name}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Click on a block in the venue map to select your seats
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketBookingSystem;