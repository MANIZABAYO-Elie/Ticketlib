import React from 'react';
import { Calendar, DollarSign, MapPin, Phone, Droplets, User } from 'lucide-react';

interface EventDetails {
  title: string;
  subtitle: string;
  location: string;
  schedule: string;
  price: string;
  priceUSD: string;
  monthlyPrice: string;
  monthlyPriceUSD: string;
  instructor: string;
  contactPhone: string;
  policies: string[];
  image: string;
}

interface Venue {
  name: string;
  image: string;
  count: number;
  type: 'Activities' | 'Events';
}

// ✅ Main Event Display Component - Simple Banner
const MainEventDisplay: React.FC<{ event: EventDetails }> = ({ event }) => {
  return (
    <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[592px] rounded-xl overflow-hidden shadow-2xl">
      <img 
        src={event.image} 
        alt={event.title}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

// ✅ Venue Card Component
const VenueCard: React.FC<{ venue: Venue }> = ({ venue }) => {
  return (
    <div className="group relative h-48 sm:h-60 lg:h-72 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${venue.image})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 text-white">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{venue.name}</h3>
        <p className="text-xs sm:text-sm opacity-90">
          {venue.count} {venue.type}
        </p>
      </div>
    </div>
  );
};

export { MainEventDisplay, VenueCard };
