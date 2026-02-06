import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  User,
  TrendingUp,
  TrendingDown,
  LogOut,
  Plus,
  Trash2,
  X,
  ShoppingCart,
  MapPin
} from 'lucide-react';
import { useLogoutMutation } from '../app/authApi';
import { useGetEventsQuery, useCreateEventMutation, useGetVenuesQuery, useSubmitEventForApprovalMutation, usePublishEventMutation, useGetApprovedEventsQuery, useDeleteEventMutation, useCreateTicketTypeMutation, useGetTicketTypesQuery, useDeleteTicketTypeMutation, useUpdateTicketTypeMutation, useGetEventSeatMapQuery, useGetAvailableSeatsByTicketTypeQuery, useCreateSeatMutation, useGetVenueSeatsQuery } from '../app/organizerApi';

// ============= INTERFACES =============
interface MenuItem {
  name: string;
  icon: React.ReactNode;
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface SidebarProps {
  menuItems: MenuItem[];
  activeMenu: string;
  onMenuClick: (name: string) => void;
  onLogout: () => void;
}

interface HeaderProps {
  userName: string;
  userRole: string;
}

// ============= REUSABLE COMPONENTS =============
const Logo: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
      <Ticket className="w-5 h-5 text-white" />
    </div>
    <span className="text-xl font-bold text-gray-900">ticketLIB</span>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ menuItems, activeMenu, onMenuClick, onLogout }) => (
  <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
    <div className="p-6 border-b border-gray-200">
      <Logo />
    </div>
    <nav className="flex-1 p-4">
      {menuItems.map((item) => (
        <button
          key={item.name}
          onClick={() => onMenuClick(item.name)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
            activeMenu === item.name
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {item.icon}
          <span className="font-medium">{item.name}</span>
        </button>
      ))}
    </nav>
    <div className="p-4 border-t border-gray-200">
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  </div>
);

const Header: React.FC<HeaderProps> = ({ userName, userRole }) => (
  <header className="bg-blue-600 text-white px-8 py-4">
    <div className="flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-2 bg-blue-500 bg-opacity-50 border border-blue-400 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:bg-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-8">
        <button className="relative p-2 hover:bg-blue-500 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-blue-400">
          <div className="text-right">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-blue-200">{userRole}</p>
          </div>
          <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  </header>
);

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}></div>
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-3">{value}</h3>
    <div className="flex items-center gap-2">
      {isPositive ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </span>
      <span className="text-xs text-gray-500">vs last month</span>
    </div>
  </div>
);

const StatsGrid: React.FC<{ stats: StatCardProps[] }> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
    {stats.map((stat, index) => (
      <StatCard key={index} {...stat} />
    ))}
  </div>
);

// Approved Events Management Component
const ApprovedEventsManagement: React.FC = () => {
  const { data: approvedEventsData, isLoading, error } = useGetApprovedEventsQuery();
  const [publishEvent] = usePublishEventMutation();
  
  const handlePublishEvent = async (eventId: number) => {
    try {
      await publishEvent(eventId).unwrap();
    } catch (error) {
      console.error('Failed to publish event:', error);
    }
  };
  
  if (isLoading) return <div className="text-center py-4">Loading approved events...</div>;
  if (error) return <div className="text-red-600 text-center py-4">Error loading approved events</div>;
  
  const approvedEvents = approvedEventsData?.results || [];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Approved Events</h1>
        <div className="text-sm text-gray-500">
          Total: {approvedEvents.length} approved events ready to publish
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {approvedEvents.map((event: any) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {event.banner_image && (
                        <img 
                          src={event.banner_image} 
                          alt={event.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.venue?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{event.venue?.city}, {event.venue?.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.start_datetime ? new Date(event.start_datetime).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handlePublishEvent(event.id)}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200"
                    >
                      Publish Event
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {approvedEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No approved events</h3>
            <p className="text-gray-500">Approved events ready to publish will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Events Management Component
const EventsManagement: React.FC = () => {
  const { data: eventsData, isLoading, error } = useGetEventsQuery();
  const { data: venuesData } = useGetVenuesQuery();
  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [submitForApproval] = useSubmitEventForApprovalMutation();
  const [publishEvent] = usePublishEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; eventId: number | null; eventTitle: string }>({ show: false, eventId: null, eventTitle: '' });
  const [ticketModal, setTicketModal] = useState<{ show: boolean; eventId: number | null; eventTitle: string; view: 'list' | 'create' }>({ show: false, eventId: null, eventTitle: '', view: 'list' });
  const [createTicketType] = useCreateTicketTypeMutation();
  const [ticketForm, setTicketForm] = useState({ name: '', description: '', price: '', quantity_available: '', sale_start: '', sale_end: '' });
  const { data: ticketTypesData } = useGetTicketTypesQuery(ticketModal.eventId || 0, { skip: !ticketModal.eventId });
  const [buyModal, setBuyModal] = useState<{ show: boolean; eventId: number | null; eventTitle: string }>({ show: false, eventId: null, eventTitle: '' });
  const { data: buyTicketTypesData } = useGetTicketTypesQuery(buyModal.eventId || 0, { skip: !buyModal.eventId });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    category: '',
    start_datetime: '',
    end_datetime: '',
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData = new FormData();
      eventData.append('title', formData.title);
      eventData.append('description', formData.description);
      eventData.append('venue', formData.venue);
      eventData.append('category', formData.category);
      eventData.append('start_datetime', formData.start_datetime);
      eventData.append('end_datetime', formData.end_datetime);
      eventData.append('status', 'draft');
      if (bannerFile) {
        eventData.append('banner_image', bannerFile);
      }
      
      await createEvent(eventData as any).unwrap();
      setFormData({ title: '', description: '', venue: '', category: '', start_datetime: '', end_datetime: '' });
      setBannerFile(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleSubmitForApproval = async (eventId: number) => {
    try {
      await submitForApproval(eventId).unwrap();
    } catch (error) {
      console.error('Failed to submit for approval:', error);
    }
  };

  const handlePublishEvent = async (eventId: number) => {
    try {
      await publishEvent(eventId).unwrap();
    } catch (error) {
      console.error('Failed to publish event:', error);
    }
  };

  const handleDeleteEvent = async () => {
    if (deleteModal.eventId) {
      try {
        await deleteEvent(deleteModal.eventId).unwrap();
        setDeleteModal({ show: false, eventId: null, eventTitle: '' });
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleCreateTicketType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketModal.eventId) {
      try {
        await createTicketType({ eventId: ticketModal.eventId, data: { ...ticketForm, quantity_available: Number(ticketForm.quantity_available) } }).unwrap();
        setTicketModal({ show: true, eventId: ticketModal.eventId, eventTitle: ticketModal.eventTitle, view: 'list' });
        setTicketForm({ name: '', description: '', price: '', quantity_available: '', sale_start: '', sale_end: '' });
      } catch (error) {
        console.error('Failed to create ticket type:', error);
      }
    }
  };
  
  if (isLoading) return <div className="text-center py-4">Loading events...</div>;
  if (error) return <div className="text-red-600 text-center py-4">Error loading events</div>;
  
  const events = eventsData?.results || [];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total: {events.length} events
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>
      </div>
      
      {showCreateForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                name="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <select
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Venue</option>
                {venuesData?.data?.map((venue: any) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} - {venue.city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="concert">Concert</option>
                <option value="conference">Conference</option>
                <option value="sports">Sports</option>
                <option value="festival">Festival</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setBannerFile(file);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
              <input
                type="datetime-local"
                name="start_datetime"
                value={formData.start_datetime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                name="end_datetime"
                value={formData.end_datetime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Description</label>
              <textarea
                name="description"
                placeholder="Enter event description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event: any) => {
                const { data: eventTickets } = useGetTicketTypesQuery(event.id);
                const ticketCount = eventTickets?.results?.length || 0;
                return (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {event.banner_image && (
                          <img 
                            src={event.banner_image} 
                            alt={event.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.venue?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{event.venue?.city}, {event.venue?.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.start_datetime ? new Date(event.start_datetime).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        event.status === 'published' ? 'bg-green-100 text-green-800' :
                        event.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        event.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{ticketCount} ticket types</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {event.status === 'draft' && (
                          <button
                            onClick={() => handleSubmitForApproval(event.id)}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                          >
                            Submit for Approval
                          </button>
                        )}
                        {event.status === 'approved' && (
                          <button
                            onClick={() => handlePublishEvent(event.id)}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => setTicketModal({ show: true, eventId: event.id, eventTitle: event.title, view: 'list' })}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200"
                          title="Manage Tickets"
                        >
                          <Ticket className="w-3 h-3" />
                        </button>
                        {event.status === 'published' && (
                          <button
                            onClick={() => setBuyModal({ show: true, eventId: event.id, eventTitle: event.title })}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200"
                            title="Buy Tickets"
                          >
                            <ShoppingCart className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteModal({ show: true, eventId: event.id, eventTitle: event.title })}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-500">Create your first event to get started</p>
          </div>
        )}
      </div>
      
      {deleteModal.show && (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Event</h3>
              <button onClick={() => setDeleteModal({ show: false, eventId: null, eventTitle: '' })} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to delete "{deleteModal.eventTitle}"? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteModal({ show: false, eventId: null, eventTitle: '' })} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDeleteEvent} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {ticketModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{ticketModal.view === 'list' ? 'Ticket Types' : 'Create Ticket Type'}</h3>
              <button onClick={() => setTicketModal({ show: false, eventId: null, eventTitle: '', view: 'list' })} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {ticketModal.view === 'list' ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">Event: {ticketModal.eventTitle}</p>
                  <button onClick={() => setTicketModal({...ticketModal, view: 'create'})} className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add Ticket Type</button>
                </div>
                <div className="space-y-3">
                  {ticketTypesData?.results?.map((ticket: any) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{ticket.name}</h4>
                          <p className="text-sm text-gray-600">{ticket.description}</p>
                          <p className="text-sm text-gray-500">Price: ${ticket.price} | Available: {ticket.quantity_available} | Sold: {ticket.quantity_sold}</p>
                        </div>
                      </div>
                    </div>
                  )) || <p className="text-gray-500 text-center py-4">No ticket types created yet</p>}
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateTicketType} className="space-y-4">
                <input placeholder="Ticket Name" value={ticketForm.name} onChange={(e) => setTicketForm({...ticketForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <textarea placeholder="Description" value={ticketForm.description} onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <input type="number" step="0.01" placeholder="Price" value={ticketForm.price} onChange={(e) => setTicketForm({...ticketForm, price: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <input type="number" placeholder="Quantity" value={ticketForm.quantity_available} onChange={(e) => setTicketForm({...ticketForm, quantity_available: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <input type="datetime-local" placeholder="Sale Start" value={ticketForm.sale_start} onChange={(e) => setTicketForm({...ticketForm, sale_start: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <input type="datetime-local" placeholder="Sale End" value={ticketForm.sale_end} onChange={(e) => setTicketForm({...ticketForm, sale_end: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setTicketModal({...ticketModal, view: 'list'})} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Create</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      
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
              {buyTicketTypesData?.results?.map((ticket: any) => (
                <div key={ticket.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{ticket.name}</h4>
                    <p className="text-sm text-gray-600">{ticket.description}</p>
                    <p className="text-sm text-gray-500">Price: ${ticket.price} | Available: {ticket.quantity_available - ticket.quantity_sold}</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Buy</button>
                </div>
              )) || <p className="text-gray-500 text-center py-4">No tickets available</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Ticket Event Card Component
const TicketEventCard: React.FC<{ event: any }> = ({ event }) => {
  const { data: eventTickets } = useGetTicketTypesQuery(event.id);
  const [ticketModal, setTicketModal] = useState<{ show: boolean; eventId: number | null; eventTitle: string; view: 'list' | 'create' | 'edit' | 'seatmap' | 'available' | 'createseat' | 'venueseats'; editTicketId?: number }>({ show: false, eventId: null, eventTitle: '', view: 'list' });
  const [createTicketType] = useCreateTicketTypeMutation();
  const [deleteTicketType] = useDeleteTicketTypeMutation();
  const [updateTicketType] = useUpdateTicketTypeMutation();
  const [createSeat] = useCreateSeatMutation();
  const [ticketForm, setTicketForm] = useState({ name: '', description: '', price: '', quantity_available: '', sale_start: '', sale_end: '' });
  const [seatForm, setSeatForm] = useState({ section: '', row: '', number: '', is_accessible: false });
  const { data: seatMapData } = useGetEventSeatMapQuery(ticketModal.eventId || 0, { skip: !ticketModal.eventId || ticketModal.view !== 'seatmap' });
  const { data: availableSeatsData } = useGetAvailableSeatsByTicketTypeQuery(ticketModal.eventId || 0, { skip: !ticketModal.eventId || ticketModal.view !== 'available' });
  const { data: venueSeatsData } = useGetVenueSeatsQuery(event.venue?.id || 0, { skip: !event.venue?.id || ticketModal.view !== 'venueseats' });
  const { data: ticketTypesData } = useGetTicketTypesQuery(ticketModal.eventId || 0, { skip: !ticketModal.eventId });

  const handleCreateTicketType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketModal.eventId) {
      try {
        await createTicketType({ eventId: ticketModal.eventId, data: { ...ticketForm, quantity_available: Number(ticketForm.quantity_available) } }).unwrap();
        setTicketModal({ show: true, eventId: ticketModal.eventId, eventTitle: ticketModal.eventTitle, view: 'list' });
        setTicketForm({ name: '', description: '', price: '', quantity_available: '', sale_start: '', sale_end: '' });
      } catch (error) {
        console.error('Failed to create ticket type:', error);
      }
    }
  };

  const handleDeleteTicketType = async (ticketId: number) => {
    try {
      await deleteTicketType({ eventId: event.id, ticketId }).unwrap();
    } catch (error) {
      console.error('Failed to delete ticket type:', error);
    }
  };

  const handleEditTicketType = (ticket: any) => {
    setTicketForm({
      name: ticket.name,
      description: ticket.description,
      price: ticket.price,
      quantity_available: ticket.quantity_available.toString(),
      sale_start: ticket.sale_start,
      sale_end: ticket.sale_end
    });
    setTicketModal({ show: true, eventId: event.id, eventTitle: event.title, view: 'edit', editTicketId: ticket.id });
  };

  const handleUpdateTicketType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketModal.eventId && ticketModal.editTicketId) {
      try {
        await updateTicketType({ 
          eventId: ticketModal.eventId, 
          ticketId: ticketModal.editTicketId, 
          data: { ...ticketForm, quantity_available: Number(ticketForm.quantity_available) } 
        }).unwrap();
        setTicketModal({ show: false, eventId: null, eventTitle: '', view: 'list' });
        setTicketForm({ name: '', description: '', price: '', quantity_available: '', sale_start: '', sale_end: '' });
      } catch (error) {
        console.error('Failed to update ticket type:', error);
      }
    }
  };

  const handleCreateSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (event.venue?.id) {
      try {
        await createSeat({ venueId: event.venue.id, data: seatForm }).unwrap();
        setTicketModal({ show: false, eventId: null, eventTitle: '', view: 'list' });
        setSeatForm({ section: '', row: '', number: '', is_accessible: false });
      } catch (error) {
        console.error('Failed to create seat:', error);
      }
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {event.banner_image && (
            <img src={event.banner_image} alt={event.title} className="w-16 h-16 object-cover rounded-xl shadow-md" />
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
            <p className="text-sm text-gray-500">{event.venue?.name || 'No venue'} • {event.start_datetime ? new Date(event.start_datetime).toLocaleDateString() : 'TBA'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTicketModal({ show: true, eventId: event.id, eventTitle: event.title, view: 'venueseats' })}
            className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium"
          >
            <MapPin className="w-4 h-4" />
            Venue Seats
          </button>
          <button
            onClick={() => setTicketModal({ show: true, eventId: event.id, eventTitle: event.title, view: 'createseat' })}
            className="bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Seat
          </button>
          <button
            onClick={() => setTicketModal({ show: true, eventId: event.id, eventTitle: event.title, view: 'available' })}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Ticket className="w-4 h-4" />
            Available
          </button>
          <button
            onClick={() => setTicketModal({ show: true, eventId: event.id, eventTitle: event.title, view: 'seatmap' })}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
          >
            <MapPin className="w-4 h-4" />
            Seat Map
          </button>
          <button
            onClick={() => setTicketModal({ show: true, eventId: event.id, eventTitle: event.title, view: 'create' })}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Ticket
          </button>
        </div>
      </div>
      {eventTickets?.results?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {eventTickets.results.map((ticket: any) => (
            <div key={ticket.id} className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900 text-lg">{ticket.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">${ticket.price}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button 
                      onClick={() => handleEditTicketType(ticket)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors" 
                      title="Edit"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTicketType(ticket.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors" 
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>
              <div className="flex justify-between items-center text-sm mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-gray-600">{ticket.quantity_available} available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  <span className="text-gray-600">{ticket.quantity_sold} sold</span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Sale: {ticket.sale_start ? new Date(ticket.sale_start).toLocaleDateString() : 'N/A'}</span>
                  <span>End: {ticket.sale_end ? new Date(ticket.sale_end).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No ticket types created</p>
          <p className="text-sm text-gray-400 mb-4">Create ticket types to start selling</p>
          <button
            onClick={() => setTicketModal({ show: true, eventId: event.id, eventTitle: event.title, view: 'create' })}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Create First Ticket Type
          </button>
        </div>
      )}
      
      {ticketModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {ticketModal.view === 'edit' ? 'Edit Ticket Type' : 
                 ticketModal.view === 'seatmap' ? 'Event Seat Map' :
                 ticketModal.view === 'available' ? 'Available Seats by Ticket Type' :
                 ticketModal.view === 'createseat' ? 'Create Seat' :
                 ticketModal.view === 'venueseats' ? 'Venue Seats' : 'Create Ticket Type'}
              </h3>
              <button onClick={() => setTicketModal({ show: false, eventId: null, eventTitle: '', view: 'list' })} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {ticketModal.view === 'available' ? (
              <div className="space-y-4">
                <p className="text-gray-600">Event: {ticketModal.eventTitle}</p>
                <div className="max-h-96 overflow-y-auto">
                  {availableSeatsData?.results?.filter(seat => !seat.is_reserved).map((seatItem) => (
                    <div key={seatItem.id} className="border rounded-lg p-3 mb-2 flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          Section {seatItem.seat.section}, Row {seatItem.seat.row}, Seat {seatItem.seat.number}
                        </div>
                        <div className="text-sm text-gray-600">
                          {seatItem.ticket_type.name} - ${seatItem.ticket_type.price}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Available</span>
                        {seatItem.seat.is_accessible && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Accessible</span>
                        )}
                      </div>
                    </div>
                  )) || <p className="text-gray-500 text-center py-4">No available seats</p>}
                </div>
              </div>
            ) : ticketModal.view === 'seatmap' ? (
              <div className="space-y-4">
                <p className="text-gray-600">Event: {ticketModal.eventTitle}</p>
                <div className="max-h-96 overflow-y-auto">
                  {seatMapData?.results?.map((seatItem) => (
                    <div key={seatItem.id} className="border rounded-lg p-3 mb-2 flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          Section {seatItem.seat.section}, Row {seatItem.seat.row}, Seat {seatItem.seat.number}
                        </div>
                        <div className="text-sm text-gray-600">
                          {seatItem.ticket_type.name} - ${seatItem.ticket_type.price}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          seatItem.is_reserved ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {seatItem.is_reserved ? 'Reserved' : 'Available'}
                        </span>
                        {seatItem.seat.is_accessible && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Accessible</span>
                        )}
                      </div>
                    </div>
                  )) || <p className="text-gray-500 text-center py-4">No seat map data available</p>}
                </div>
              </div>
            ) : ticketModal.view === 'venueseats' ? (
              <div className="space-y-4">
                <p className="text-gray-600">Venue: {event.venue?.name || 'Unknown Venue'}</p>
                <div className="max-h-96 overflow-y-auto">
                  {venueSeatsData?.results?.map((seat) => (
                    <div key={seat.id} className="border rounded-lg p-3 mb-2 flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          Section {seat.section}, Row {seat.row}, Seat {seat.number}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {seat.is_accessible && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Accessible</span>
                        )}
                      </div>
                    </div>
                  )) || <p className="text-gray-500 text-center py-4">No seats found</p>}
                </div>
              </div>
            ) : ticketModal.view === 'createseat' ? (
              <form onSubmit={handleCreateSeat} className="space-y-4">
                <input placeholder="Section" value={seatForm.section} onChange={(e) => setSeatForm({...seatForm, section: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <input placeholder="Row" value={seatForm.row} onChange={(e) => setSeatForm({...seatForm, row: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <input placeholder="Seat Number" value={seatForm.number} onChange={(e) => setSeatForm({...seatForm, number: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={seatForm.is_accessible} onChange={(e) => setSeatForm({...seatForm, is_accessible: e.target.checked})} />
                  <span>Accessible Seat</span>
                </label>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setTicketModal({ show: false, eventId: null, eventTitle: '', view: 'list' })} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Create Seat</button>
                </div>
              </form>
            ) : (
              <form onSubmit={ticketModal.view === 'edit' ? handleUpdateTicketType : handleCreateTicketType} className="space-y-4">
                <input placeholder="Ticket Name" value={ticketForm.name} onChange={(e) => setTicketForm({...ticketForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <textarea placeholder="Description" value={ticketForm.description} onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <input type="number" step="0.01" placeholder="Price" value={ticketForm.price} onChange={(e) => setTicketForm({...ticketForm, price: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <input type="number" placeholder="Quantity" value={ticketForm.quantity_available} onChange={(e) => setTicketForm({...ticketForm, quantity_available: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <input type="datetime-local" placeholder="Sale Start" value={ticketForm.sale_start} onChange={(e) => setTicketForm({...ticketForm, sale_start: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <input type="datetime-local" placeholder="Sale End" value={ticketForm.sale_end} onChange={(e) => setTicketForm({...ticketForm, sale_end: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setTicketModal({ show: false, eventId: null, eventTitle: '', view: 'list' })} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{ticketModal.view === 'edit' ? 'Update' : 'Create'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============= MAIN DASHBOARD COMPONENT =============
const OrganizerDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [logoutMutation] = useLogoutMutation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  // Fetch data
  const { data: eventsData } = useGetEventsQuery();
  
  // Calculate stats
  const totalEvents = eventsData?.count || eventsData?.results?.length || 0;
  const draftEvents = eventsData?.results?.filter((e: any) => e.status === 'draft')?.length || 0;
  const pendingEvents = eventsData?.results?.filter((e: any) => e.status === 'pending')?.length || 0;
  const approvedEvents = eventsData?.results?.filter((e: any) => e.status === 'approved')?.length || 0;
  const publishedEvents = eventsData?.results?.filter((e: any) => e.status === 'published')?.length || 0;

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('email');
      localStorage.removeItem('full_name');
      localStorage.removeItem('user_id');
      navigate('/signIn');
    }
  };

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'My Events', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Approved Events', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Tickets', icon: <Ticket className="w-5 h-5" /> },
    { name: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleMenuClick = (name: string) => {
    if (name === 'Logout') {
      handleLogout();
    } else {
      setActiveMenu(name);
    }
  };

  const stats: StatCardProps[] = [
    { title: 'Total Events', value: totalEvents.toString(), change: '+8.2%', isPositive: true },
    { title: 'Draft Events', value: draftEvents.toString(), change: '+3.1%', isPositive: true },
    { title: 'Pending Events', value: pendingEvents.toString(), change: '+5.1%', isPositive: true },
    { title: 'Approved Events', value: approvedEvents.toString(), change: '+12.3%', isPositive: true },
    { title: 'Published Events', value: publishedEvents.toString(), change: '+7.8%', isPositive: true },
  ];

  const events = eventsData?.results || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        menuItems={menuItems} 
        activeMenu={activeMenu} 
        onMenuClick={handleMenuClick}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={user?.fullName || localStorage.getItem('full_name') || 'Organizer'} userRole={user?.role || 'Organizer'} />

        <main className="flex-1 overflow-y-auto p-8">
          {activeMenu === 'Dashboard' && <StatsGrid stats={stats} />}
          {activeMenu === 'My Events' && <EventsManagement />}
          {activeMenu === 'Approved Events' && <ApprovedEventsManagement />}
          
          {activeMenu === 'Tickets' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Ticket Management</h1>
                  <p className="text-gray-600">Manage all ticket types across your events</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-xl">
                  <span className="text-blue-700 font-semibold">{(eventsData?.results || []).length} Events</span>
                </div>
              </div>
              <div className="space-y-8">
                {(eventsData?.results || []).map((event: any) => (
                  <TicketEventCard key={event.id} event={event} />
                ))}
                {(eventsData?.results || []).length === 0 && (
                  <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Ticket className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-500 mb-6">Create events first to manage their tickets</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                      Create Your First Event
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeMenu === 'Analytics' && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-500">Advanced analytics coming soon</p>
            </div>
          )}
          
          {activeMenu === 'Settings' && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
              <p className="text-gray-500">Configuration options coming soon</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OrganizerDashboard;