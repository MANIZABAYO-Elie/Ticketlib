



import React from "react";
import { Button } from "./Button"; // assumes Button supports `variant` and `size` props

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-900 to-blue-500 text-white py-24 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
          Rwanda&apos;s Leading E-Ticketing Platform
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-blue-100 mb-10">
          Book tickets for concerts, sports events, festivals, and more with ease
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* Primary Button */}
          <Button
            size="lg"
            className="bg-white text-blue-700 font-semibold rounded-full px-8 py-3 hover:bg-blue-100 transition duration-300"
          >
            Browse Events
          </Button>

          {/* Outline Button */}
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white text-white rounded-full px-8 py-3 hover:bg-white hover:text-blue-700 transition duration-300"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
