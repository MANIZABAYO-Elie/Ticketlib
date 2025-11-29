import React, { useState } from 'react';
import { Ticket, Info } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  price: number;
  available: boolean;
  color: 'teal' | 'gray' | 'blue' | 'red' | 'purple';
}

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'unavailable';
}

interface VenueBlocks {
  upperLevel: string[];
  middleLevel: string[];
  lowerMiddle: string[];
  bottomLevel: string[];
  vipLevel: string[];
  bottomSeats: string[];
}

const TicketBookingSystem: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const categories: Category[] = [
    { id: 1, name: 'BRONZE', price: 15000, available: true, color: 'teal' },
    { id: 2, name: 'FLOOR STANDING', price: 25000, available: false, color: 'gray' },
    { id: 3, name: 'SILVER', price: 30000, available: true, color: 'gray' },
    { id: 4, name: 'PREMIUM', price: 50000, available: true, color: 'blue' },
    { id: 5, name: 'VIP', price: 100000, available: true, color: 'red' },
    { id: 6, name: 'GOLDEN CIRCLE', price: 100000, available: true, color: 'purple' }
  ];

  const venueBlocks: VenueBlocks = {
    upperLevel: ['205', '206', '207', '208', '209', '210', '211'],
    middleLevel: ['204', 'P4', '104', '103', '105', '106', 'P6', '107', '108', 'P6', '109', '110'],
    lowerMiddle: ['203', 'P3', '102', '101', '120', '119', '118', '117', '116', '115'],
    bottomLevel: ['202', 'P2', '122', 'P1', '121'],
    vipLevel: ['VIP10', 'VIP9', 'VIP8', 'VIP7', 'VIP6', 'VIP5', 'VIP4', 'VIP3', 'VIP2', 'VIP1'],
    bottomSeats: ['222', '221', '220', '219', '218', '217', '216']
  };

  const generateSeats = (): Seat[] => {
    const rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const seatsPerRow: Record<string, number> = {
      'A': 17, 'B': 17, 'C': 15, 'D': 14, 'E': 12, 'F': 12, 'G': 14, 'H': 14, 'I': 15
    };
    
    const seats: Seat[] = [];
    rows.forEach(row => {
      const numSeats = seatsPerRow[row];
      for (let i = 1; i <= numSeats; i++) {
        const isUnavailable = Math.random() > 0.7;
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          status: isUnavailable ? 'unavailable' : 'available'
        });
      }
    });
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
    }
  };

  const handleBlockSelect = (block: string): void => {
    if (selectedCategory) {
      setSelectedBlock(block);
    }
  };

  const totalPrice: number = selectedSeats.length * (selectedCategory?.price || 0);

  const getColorClass = (color: Category['color']): string => {
    const colorMap: Record<Category['color'], string> = {
      'teal': 'text-teal-500',
      'blue': 'text-blue-600',
      'red': 'text-red-600',
      'purple': 'text-purple-600',
      'gray': 'text-gray-400'
    };
    return colorMap[color];
  };

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
              <p className="text-center text-gray-600 mb-4">FRONT VIEW</p>
              <div className="space-y-2">
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map(row => (
                  <div key={row} className="flex items-center justify-center gap-1">
                    <span className="w-8 text-center font-semibold text-gray-700">{row}</span>
                    <div className="flex gap-1 flex-wrap justify-center">
                      {seats.filter(s => s.row === row).map(seat => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={seat.status === 'unavailable'}
                          className={`w-8 h-8 rounded ${
                            selectedSeats.includes(seat.id)
                              ? 'bg-green-500'
                              : seat.status === 'unavailable'
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          } transition-colors`}
                          title={seat.id}
                        />
                      ))}
                    </div>
                  </div>
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
              <button className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
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
            {/* Upper Level */}
            <div className="flex justify-center gap-2 mb-4">
              {venueBlocks.upperLevel.map(block => (
                <button
                  key={block}
                  onClick={() => handleBlockSelect(block)}
                  className="w-16 h-16 bg-gray-300 rounded text-xs font-semibold hover:bg-gray-400 transition-colors"
                >
                  {block}
                </button>
              ))}
            </div>

            {/* Middle Level */}
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              {venueBlocks.middleLevel.map(block => (
                <button
                  key={block}
                  onClick={() => handleBlockSelect(block)}
                  className={`w-14 h-14 rounded text-xs font-semibold transition-colors ${
                    block.startsWith('P') 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                >
                  {block}
                </button>
              ))}
            </div>

            {/* Stage */}
            <div className="flex justify-center mb-4">
              <div className="flex gap-4 items-center">
                <div className="w-96 h-32 bg-amber-200 rounded flex items-center justify-center">
                  <span className="text-lg font-bold">STAGE AREA</span>
                </div>
                <div className="w-24 h-32 bg-orange-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">STAGE</span>
                </div>
              </div>
            </div>

            {/* Lower Middle */}
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              {venueBlocks.lowerMiddle.map(block => (
                <button
                  key={block}
                  onClick={() => handleBlockSelect(block)}
                  className={`w-14 h-14 rounded text-xs font-semibold transition-colors ${
                    block.startsWith('P') 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                >
                  {block}
                </button>
              ))}
            </div>

            {/* Bottom Level */}
            <div className="flex justify-center gap-2 mb-4">
              {venueBlocks.bottomLevel.map(block => (
                <button
                  key={block}
                  onClick={() => handleBlockSelect(block)}
                  className={`w-14 h-14 rounded text-xs font-semibold transition-colors ${
                    block.startsWith('P') 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                >
                  {block}
                </button>
              ))}
            </div>

            {/* VIP Level */}
            <div className="flex justify-center gap-1 mb-4">
              {venueBlocks.vipLevel.map(block => (
                <button
                  key={block}
                  onClick={() => handleBlockSelect(block)}
                  className="w-12 h-8 bg-orange-600 rounded text-xs font-bold text-white hover:bg-orange-700 transition-colors"
                >
                  {block}
                </button>
              ))}
            </div>

            {/* Bottom Seats */}
            <div className="flex justify-center gap-2">
              {venueBlocks.bottomSeats.map(block => (
                <button
                  key={block}
                  onClick={() => handleBlockSelect(block)}
                  className="w-16 h-16 bg-blue-700 rounded text-xs font-semibold text-white hover:bg-blue-800 transition-colors"
                >
                  {block}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span>Blocks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-700 rounded"></div>
                <span>Highlighted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Categories */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Ticket categories</h2>
          <p className="text-sm text-gray-500 mb-6">Select a ticket category below to show available spots for purchase.</p>
          
          <div className="space-y-3">
            {categories.map(category => (
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
                    <Ticket className={getColorClass(category.color)} />
                    <div className="text-left">
                      <div className="font-bold">{category.name}</div>
                      <div className="text-sm text-gray-600">{category.price.toLocaleString()} Rwf</div>
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
            ))}
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