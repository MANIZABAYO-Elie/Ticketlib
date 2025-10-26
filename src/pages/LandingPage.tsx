import React from "react";
import Header from "../components/header"; 
import HeroSection from "../components/HeroSection";
import { BsTicket } from "react-icons/bs";
import { BsCalendar2Event } from "react-icons/bs";
import { FaCompass } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { MainEventDisplay, VenueCard } from "../components/MainEventDisplay";
import Footer from "../components/Footer";


const LandingPage: React.FC = () => {
  // Define your navigation links
  const navLinks = [
    { 
      name: "Events", 
      path: "/", 
      icon:<BsCalendar2Event className="w-4 h-4 mr-2"/>
    },
    { 
      name: "Tickets", 
      path: "/", 
      icon:<BsTicket className="w-4 h-4 mr-2"/>
    },
    
    { 
      name: "Discover", 
      path: "", 
      icon:<FaCompass className="w-4 h-4 mr-2"/>
    
    },
    { 
      name: "Contact us", 
      path: "/contact", 
      icon:<LuMessageCircleMore className="w-4 h-4 mr-2"/>
    
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header brandName="TicketLIB" navLinks={navLinks} />

      {/* Main Content */}
       <HeroSection/>
       <div className="flex gap-6 p-6">
         <div className="flex-1">
           <MainEventDisplay event={{
             title: 'NIWE HEALING CONCERT',
             subtitle: 'Experience the healing power of music',
             location: 'Kigali Convention Centre',
             schedule: 'Dec 15, 2024 - 7:00 PM',
             price: '15,000 RWF',
             priceUSD: '$12',
             monthlyPrice: '45,000 RWF',
             monthlyPriceUSD: '$35',
             instructor: 'Various Artists',
             contactPhone: '+250 788 123 456',
             policies: ['No outside food or drinks', 'Valid ID required', 'No refunds'],
             image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
           }}/>
         </div>
         <div className="w-1/2">
           <div className="grid grid-cols-2 gap-4">
             <VenueCard venue={{
               name: 'Kigali Convention Centre',
               image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
               count: 25,
               type: 'Events'
             }}/>
             <VenueCard venue={{
               name: 'BK Arena',
               image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
               count: 18,
               type: 'Events'
             }}/>
             <VenueCard venue={{
               name: 'Intare Arena',
               image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
               count: 12,
               type: 'Activities'
             }}/>
             <VenueCard venue={{
               name: 'Camp Kigali',
               image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
               count: 8,
               type: 'Events'
             }}/>
           </div>
         </div>
       </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default LandingPage;
