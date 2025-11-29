import React, { useState, useEffect } from "react";
import Header from "../components/header"; 
//import HeroSection from "../components/HeroSection";
import { BsTicket } from "react-icons/bs";
import { BsCalendar2Event } from "react-icons/bs";
import { FaCompass } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { MainEventDisplay, VenueCard } from "../components/MainEventDisplay";
import Footer from "../components/Footer";
import bkArenaImage from "../assets/images/bk-arena.png";
import conventionCenterImage from "../assets/images/convention-center.png";
import intareArenaImage from "../assets/images/INTARE-ARENA.png";
import ticketlibLogo from "../assets/images/ticketlib.jpg";
import SearchBarWithIcons from "../components/SearchBarWithIcons";
import { useGetEventsQuery } from "../app/organizerApi";


const LandingPage: React.FC = () => {
  const { data: eventsData, isLoading, error } = useGetEventsQuery();
  const events = eventsData?.results || [];
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const featuredEvent = events[currentEventIndex] || events[0];
  
  // Auto-slide events every 3 seconds
  useEffect(() => {
    if (events.length > 1) {
      const interval = setInterval(() => {
        setCurrentEventIndex((prev) => (prev + 1) % events.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [events.length]);
  
  console.log('LandingPage - eventsData:', eventsData);
  console.log('LandingPage - isLoading:', isLoading);
  console.log('LandingPage - error:', error);
  console.log('LandingPage - events:', events);
  console.log('LandingPage - featuredEvent:', featuredEvent);

  // Define your navigation links
  const navLinks = [
    { 
      name: "Events", 
      path: "/", 
      icon:<BsCalendar2Event className="w-6 h-6 mr-3"/>
    },
    { 
      name: "Tickets", 
      path: "/", 
      icon:<BsTicket className="w-6 h-6 mr-3"/>
    },
    
    { 
      name: "Discover", 
      path: "", 
      icon:<FaCompass className="w-6 h-6 mr-3"/>
    
    },
    { 
      name: "Contact us", 
      path: "/contact", 
      icon:<LuMessageCircleMore className="w-6 h-6 mr-3"/>
    
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header brandName="TicketLIB" navLinks={navLinks} logoUrl={ticketlibLogo} />
      <SearchBarWithIcons/>

      {/* Main Content */}
       {/* <HeroSection/> */}
       <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
         <div className="flex-1 relative">
           {featuredEvent && (
             <>
               <MainEventDisplay event={{
                 title: featuredEvent.title,
                 subtitle: featuredEvent.description,
                 location: typeof featuredEvent.venue === 'object' ? featuredEvent.venue.name : `Venue #${featuredEvent.venue}`,
                 schedule: featuredEvent.start_datetime ? new Date(featuredEvent.start_datetime).toLocaleDateString() : 'TBA',
                 price: '15,000 RWF',
                 priceUSD: '$12',
                 monthlyPrice: '45,000 RWF',
                 monthlyPriceUSD: '$35',
                 instructor: 'Various Artists',
                 contactPhone: '+250 788 123 456',
                 policies: ['No outside food or drinks', 'Valid ID required', 'No refunds'],
                 image: featuredEvent.banner_image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
               }}/>
               
               {/* Slide indicators */}
               {events.length > 1 && (
                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                   {events.map((_, index) => (
                     <button
                       key={index}
                       onClick={() => setCurrentEventIndex(index)}
                       className={`w-3 h-3 rounded-full transition-colors ${
                         index === currentEventIndex ? 'bg-blue-600' : 'bg-gray-300'
                       }`}
                     />
                   ))}
                 </div>
               )}
             </>
           )}
         </div>
         <div className="w-full lg:w-1/2">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {events.slice(0, 4).map((event: any) => (
               <VenueCard 
                 key={event.id}
                 venue={{
                   name: event.title,
                   image: event.banner_image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
                   count: 1,
                   type: 'Event'
                 }}
               />
             ))}
           </div>
         </div>
       </div>

    
     

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default LandingPage;
