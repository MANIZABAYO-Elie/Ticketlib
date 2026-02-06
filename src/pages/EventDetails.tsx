import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, X } from 'lucide-react';
import { useGetPublishedEventsQuery } from '../app/organizerApi';

const EventDetails: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [showTicketModal, setShowTicketModal] = useState(false);
  
  // Fetch published events to get the specific event with ticket_types
  const { data: eventsData, isLoading, error } = useGetPublishedEventsQuery();
  
  // Find the specific event
  const currentEvent = eventsData?.results?.find((event: any) => event.id === parseInt(eventId || '0'));
  
  const ticketTypes = currentEvent?.ticket_types || [];
  
  // Debug logging
  console.log('EventDetails - eventId:', eventId);
  console.log('EventDetails - currentEvent:', currentEvent);
  console.log('EventDetails - banner_image:', currentEvent?.banner_image);
  console.log('EventDetails - ticketTypes:', ticketTypes);
  console.log('EventDetails - isLoading:', isLoading);
  console.log('EventDetails - error:', error);

  // Use actual event data from API or fallback
  const event = currentEvent || {
    id: eventId,
    title: "Event Not Found",
    description: "This event could not be loaded.",
    start_datetime: "2024-12-20T18:00:00Z",
    venue: { name: "Unknown Venue", city: "Unknown", country: "Unknown" },
    organizer_name: "Unknown Organizer",
    banner_image: null,
    ticket_types: []
  };

  const handleBuyTicket = () => {
    // Show ticket selection modal without auth check
    setShowTicketModal(true);
  };

  const handleTicketSelect = (ticket: any) => {
    // Check if user is logged in before proceeding
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please log in to buy tickets');
      navigate('/signIn');
      return;
    }
    
    // Store selected ticket info
    localStorage.setItem('selected_ticket', JSON.stringify({
      eventId: eventId,
      eventTitle: event.title,
      ticketType: ticket.name,
      price: ticket.price,
      ticketId: ticket.id
    }));
    
    // Navigate to terms and conditions
    navigate('/terms-conditions');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Events
          </button>
        </div>
      </div>

      {/* Event Details */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Image */}
          <div className="h-64 bg-cover bg-center relative" style={{ backgroundImage: `url(${currentEvent?.banner_image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white text-center">{event.title}</h1>
            </div>
          </div>

          {/* Event Info */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                <p className="text-gray-600 mb-6">{event.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>{event.start_datetime ? new Date(event.start_datetime).toLocaleDateString() : 'TBA'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>{event.start_datetime ? new Date(event.start_datetime).toLocaleTimeString() : 'TBA'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>{event.venue?.name || 'Unknown Venue'}, {event.venue?.city || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Organizer: {event.organizer_name || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Ticket Categories</h3>
                <div className="space-y-3 mb-6">
                  {ticketTypes.map((ticket: any) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-lg">{ticket.name}</div>
                          <div className="text-xl font-bold text-blue-600">RWF {parseInt(ticket.price || 0).toLocaleString()}</div>
                        </div>
                        <div className="px-3 py-1 rounded text-sm font-semibold bg-green-100 text-green-800">
                          Available: {ticket.quantity_available - ticket.quantity_sold}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{ticket.description}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 bg-gray-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-700 transition-colors"
                  >
                    Back to Events
                  </button>
                  <button
                    onClick={handleBuyTicket}
                    className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
                  >
                    Buy Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ticket Selection Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Ticket Type</h3>
              <button 
                onClick={() => setShowTicketModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {ticketTypes.length > 0 ? (
                ticketTypes.map((ticket: any) => (
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
                            Available: {ticket.quantity_available - ticket.quantity_sold}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTicketSelect(ticket)}
                        disabled={ticket.quantity_available <= ticket.quantity_sold}
                        className={`px-6 py-2 rounded-lg font-semibold ${
                          ticket.quantity_available > ticket.quantity_sold
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {ticket.quantity_available > ticket.quantity_sold ? 'Select' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tickets available for this event</p>
                  <p className="text-xs text-gray-400 mt-2">Event ID: {eventId}</p>
                  <p className="text-xs text-gray-400">Tickets: {JSON.stringify(ticketTypes)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;