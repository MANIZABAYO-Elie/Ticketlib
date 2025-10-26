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

// ✅ Main Event Display Component
const MainEventDisplay: React.FC<{ event: EventDetails }> = ({ event }) => {
  return (
    <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[592px] rounded-xl overflow-hidden shadow-2xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${event.image})`,
          filter: 'brightness(0.7)',
        }}
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/85 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-white">
        {/* Title Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
            EXPERIENCE OUTDOOR
          </h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 tracking-tight">YOGA WITH</h2>
          <p className="text-base sm:text-lg font-light mb-1">{event.title}</p>
          <p className="text-sm opacity-90">{event.subtitle}</p>
        </div>

        {/* Pricing and Info Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
          {/* Pricing Card */}
          <div className="bg-blue-600 rounded-xl p-4 sm:p-5 space-y-2 w-full lg:min-w-[18rem] lg:max-w-sm">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base">{event.schedule}</span>
            </div>
            <div className="flex items-start gap-2 text-white">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm leading-relaxed">
                <span className="font-bold">{event.price}</span>
                <span className="opacity-90"> ({event.priceUSD})</span>
                <span className="font-normal"> /day – </span>
                <span className="font-bold">{event.monthlyPrice}</span>
                <span className="opacity-90"> ({event.monthlyPriceUSD})</span>
                <span className="font-normal"> per month</span>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-4 lg:space-y-6 text-xs sm:text-sm">
            {/* Access Policies */}
            <div>
              <h3 className="text-blue-300 font-semibold mb-2 uppercase tracking-wide">
                Access Policies
              </h3>
              <ul className="space-y-1 opacity-90">
                {event.policies.map((policy, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Droplets className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                    <span>{policy}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructor Info */}
            <div>
              <h3 className="text-blue-300 font-semibold mb-2 uppercase tracking-wide">
                Instructor
              </h3>
              <div className="space-y-1 opacity-90">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{event.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{event.contactPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buy Now Button */}
        <button className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 lg:px-8 rounded-full shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base">
          Buy Now
        </button>
      </div>
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
