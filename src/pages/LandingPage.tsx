import React, { useState, useEffect } from "react";
import Header from "../components/header"; 
//import HeroSection from "../components/HeroSection";
import { BsTicket } from "react-icons/bs";
import { BsCalendar2Event } from "react-icons/bs";
import { FaCompass } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { Search, ShoppingCart, X } from "lucide-react";
import { MainEventDisplay} from "../components/MainEventDisplay";
import Footer from "../components/Footer";
import ticketlibLogo from "../assets/images/ticketlib.jpg";
import SearchBarWithIcons from "../components/SearchBarWithIcons";
import { useGetPublishedEventsQuery, useGetTicketTypesQuery } from "../app/organizerApi";


const LandingPage: React.FC = () => {
  const { data: publishedEventsData, isLoading, error } = useGetPublishedEventsQuery();
  
  const allEvents = publishedEventsData?.results || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [buyModal, setBuyModal] = useState<{ show: boolean; eventId: number | null; eventTitle: string }>({ show: false, eventId: null, eventTitle: '' });
  const { data: buyTicketTypesData } = useGetTicketTypesQuery(buyModal.eventId || 0, { skip: !buyModal.eventId });
  
  // Filter events based on search term
  let events = allEvents.filter((event: any) => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
      <div className="mb-6">
        <Header brandName="TicketLIB" navLinks={navLinks} logoUrl={ticketlibLogo} />
      </div>
      <div className="flex items-center justify-between bg-gray-100 p-2 sm:p-3 lg:p-4 rounded-full shadow-sm w-full max-w-6xl mx-auto">
        <div className="flex items-center bg-white rounded-full px-3 py-2 sm:px-4 sm:py-3 flex-1 max-w-md lg:max-w-lg">
          <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 text-sm sm:text-base outline-none bg-transparent placeholder-gray-400"
          />
        </div>
      </div>

      {/* Main Content */}
       {/* <HeroSection/> */}
       <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
         <div className="flex-1 relative">
           {featuredEvent && (
             <>
               <div className="relative">
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
                 
                 <div className="absolute bottom-4 right-4 flex gap-3">
                   <button
                     onClick={() => window.location.href = `/events/${featuredEvent.id}`}
                     className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
                   >
                     View Details
                   </button>
                   <button
                     onClick={() => setBuyModal({ show: true, eventId: featuredEvent.id, eventTitle: featuredEvent.title })}
                     className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                   >
                     Buy Tickets
                   </button>
                 </div>
                 
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
               </div>
             </>
           )}
         </div>
         <div className="w-full lg:w-1/2">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {events.slice(0, 4).map((event: any) => (
               <div 
                 key={event.id} 
                 className="group relative h-48 sm:h-60 lg:h-72 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                 onClick={() => window.location.href = `/events/${event.id}`}
               >
                 <div
                   className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                   style={{ backgroundImage: `url(${event.banner_image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'})` }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                 <div className="absolute bottom-16 right-4">
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       setBuyModal({ show: true, eventId: event.id, eventTitle: event.title });
                     }}
                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                   >
                     Buy Tickets
                   </button>
                 </div>
                 <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 text-white">
                   <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{event.title}</h3>
                   <div className="space-y-1">
                     {event.category && (
                       <p className="text-xs sm:text-sm opacity-90">
                         Category: {typeof event.category === 'object' ? event.category.name : event.category}
                       </p>
                     )}
                     {event.tags && event.tags.length > 0 && (
                       <p className="text-xs sm:text-sm opacity-90">
                         Tags: {event.tags.map((tag: any) => typeof tag === 'object' ? tag.name : tag).join(', ')}
                       </p>
                     )}
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>

    
     

      {/* Footer - positioned at bottom when no events */}
      <div className={events.length === 0 ? 'mt-auto' : ''}>
        <Footer/>
      </div>
      
      {buyModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Buy Tickets</h3>
              <button onClick={() => setBuyModal({ show: false, eventId: null, eventTitle: '' })} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Event: {buyModal.eventTitle}</p>

            <div className="space-y-3">
              {buyTicketTypesData?.results?.length > 0 ? (
                buyTicketTypesData.results.map((ticket: any) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{ticket.name}</h4>
                        <p className="text-gray-600 text-sm mb-2">{ticket.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-blue-600">
                            RWF {parseInt(ticket.price || 0).toLocaleString()}
                          </span>
                          <span className="text-sm text-green-600">
                            Available: {ticket.quantity_available - (ticket.quantity_sold || 0)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          localStorage.setItem('selected_ticket', JSON.stringify({
                            eventId: buyModal.eventId,
                            eventTitle: buyModal.eventTitle,
                            ticketType: ticket.name,
                            price: ticket.price,
                            ticketId: ticket.id
                          }));
                          window.location.href = '/terms-conditions';
                        }}
                        disabled={(ticket.quantity_available - (ticket.quantity_sold || 0)) <= 0}
                        className={`px-6 py-2 rounded-lg font-semibold ${
                          (ticket.quantity_available - (ticket.quantity_sold || 0)) > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {(ticket.quantity_available - (ticket.quantity_sold || 0)) > 0 ? 'Select' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tickets available for this event</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
