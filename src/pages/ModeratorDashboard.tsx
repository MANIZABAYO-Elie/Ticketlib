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
  Check,
  X,
  Plus
} from 'lucide-react';
import { useLogoutMutation } from '../app/authApi';
import { useGetModeratorEventsQuery, useGetPendingEventsQuery, useApproveEventMutation, useRejectEventMutation, useGetApprovedEventsQuery, useCreateEventMutation, useGetVenuesQuery } from '../app/organizerApi';

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
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
    <div className="flex items-center gap-1">
      {isPositive ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change} vs last month
      </span>
    </div>
  </div>
);

const StatsGrid: React.FC<{ stats: StatCardProps[] }> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    {stats.map((stat, index) => (
      <StatCard key={index} {...stat} />
    ))}
  </div>
);

// Pending Events Management Component
const PendingEventsManagement: React.FC = () => {
  const { data: pendingEventsData, isLoading, error } = useGetPendingEventsQuery();
  const [approveEvent, { isLoading: approving }] = useApproveEventMutation();
  const [rejectEvent, { isLoading: rejecting }] = useRejectEventMutation();
  
  const handleApprove = async (eventId: number) => {
    try {
      await approveEvent(eventId).unwrap();
    } catch (error) {
      console.error('Failed to approve event:', error);
    }
  };

  const handleReject = async (eventId: number) => {
    try {
      await rejectEvent({ id: eventId, reason: 'Event rejected by moderator' }).unwrap();
    } catch (error) {
      console.error('Failed to reject event:', error);
    }
  };
  
  if (isLoading) return <div className="text-center py-4">Loading pending events...</div>;
  if (error) return <div className="text-red-600 text-center py-4">Error loading pending events</div>;
  
  const pendingEvents = pendingEventsData?.results || [];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Events</h1>
        <div className="text-sm text-gray-500">
          Total: {pendingEvents.length} pending events
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingEvents.map((event: any) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.organizer_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.venue?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{event.venue?.city}, {event.venue?.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.start_datetime ? new Date(event.start_datetime).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(event.id)}
                        disabled={approving || rejecting}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(event.id)}
                        disabled={approving || rejecting}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {pendingEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending events</h3>
            <p className="text-gray-500">Events awaiting approval will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

// All Events Management Component
const AllEventsManagement: React.FC = () => {
  const { data: eventsData, isLoading, error } = useGetModeratorEventsQuery();
  const { data: venuesData } = useGetVenuesQuery();
  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    category: '',
    start_datetime: '',
    end_datetime: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent({
        title: formData.title,
        description: formData.description,
        venue: parseInt(formData.venue),
        category: formData.category,
        start_datetime: formData.start_datetime,
        end_datetime: formData.end_datetime,
      }).unwrap();
      setFormData({ title: '', description: '', venue: '', category: '', start_datetime: '', end_datetime: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };
  
  if (isLoading) return <div className="text-center py-4">Loading events...</div>;
  if (error) return <div className="text-red-600 text-center py-4">Error loading events</div>;
  
  const events = eventsData?.results || [];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Events</h1>
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
            <input
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
            <input
              type="datetime-local"
              name="start_datetime"
              value={formData.start_datetime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="datetime-local"
              name="end_datetime"
              value={formData.end_datetime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="md:col-span-2">
              <textarea
                name="description"
                placeholder="Event Description"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event: any) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.organizer_name || 'N/A'}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.start_datetime ? new Date(event.start_datetime).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN DASHBOARD COMPONENT =============
const ModeratorDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [logoutMutation] = useLogoutMutation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  // Fetch data
  const { data: eventsData } = useGetModeratorEventsQuery();
  const { data: pendingEventsData } = useGetPendingEventsQuery();
  const { data: approvedEventsData } = useGetApprovedEventsQuery();
  
  // Calculate stats
  const totalEvents = eventsData?.count || eventsData?.results?.length || 0;
  const pendingEvents = pendingEventsData?.count || pendingEventsData?.results?.length || 0;
  const approvedEvents = approvedEventsData?.count || approvedEventsData?.results?.length || 0;

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
    { name: 'Pending Events', icon: <Calendar className="w-5 h-5" /> },
    { name: 'All Events', icon: <Calendar className="w-5 h-5" /> },
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
    { title: 'Pending Events', value: pendingEvents.toString(), change: '+5.1%', isPositive: true },
    { title: 'Approved Events', value: approvedEvents.toString(), change: '+12.3%', isPositive: true },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        menuItems={menuItems} 
        activeMenu={activeMenu} 
        onMenuClick={handleMenuClick}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={user?.fullName || localStorage.getItem('full_name') || 'Moderator'} userRole={user?.role || 'Moderator'} />

        <main className="flex-1 overflow-y-auto p-8">
          {activeMenu === 'Dashboard' && <StatsGrid stats={stats} />}
          {activeMenu === 'Pending Events' && <PendingEventsManagement />}
          {activeMenu === 'All Events' && <AllEventsManagement />}
          
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

export default ModeratorDashboard;