import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '../app/store';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../app/authSlice';
import {
  useGetEventsQuery,
  useApproveEventMutation,
  useRejectEventMutation
} from '../app/organizerApi';
import { Button } from '../components/Button';
import {
  LayoutGrid,
  Calendar,
  Ticket,
  Users,
  Settings,
  Bell,
  User,
  Search,
  MapPin,
  CheckCircle,
  XCircle,
  LogOut
} from 'lucide-react';

type Venue = {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  created_at: string;
  google_maps_url?: string | null;
};

type EventItem = {
  id: number;
  title: string;
  description: string;
  banner_image?: string | null;
  tags?: string[];
  start_datetime: string | null;
  end_datetime: string | null;
  venue: number | Venue;
  venue_name?: string;
  category?: string[] | null;
  created_at?: string;
};

const Sidebar: React.FC<{ activeItem: string; onItemClick: (item: string) => void }> = ({ activeItem, onItemClick }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', id: 'dashboard' },
    { icon: Calendar, label: 'Events', id: 'events' },
    { icon: Users, label: 'Users', id: 'users' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signIn');
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Ticket className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl">ticketLIB</span>
        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">MOD</span>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeItem === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

const Header: React.FC<{ userName?: string }> = ({ userName }) => {
  return (
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
              <p className="text-sm font-medium">{userName || 'Moderator'}</p>
              <p className="text-xs text-blue-200">Content Moderator</p>
            </div>
            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Card: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({
  title,
  children,
  action
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
};

const ModeratorDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth || {});
  const [activeMenuItem, setActiveMenuItem] = useState('events');
  const [rejectingEvent, setRejectingEvent] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useGetEventsQuery();
  const [approveEvent] = useApproveEventMutation();
  const [rejectEvent] = useRejectEventMutation();

  const events: EventItem[] = (eventsData && (eventsData as any).results) ? (eventsData as any).results : [];
  
  console.log('ModeratorDashboard - eventsData:', eventsData);
  console.log('ModeratorDashboard - eventsLoading:', eventsLoading);
  console.log('ModeratorDashboard - eventsError:', eventsError);
  console.log('ModeratorDashboard - events array:', events);

  const handleApprove = async (id: number) => {
    try {
      await approveEvent(id).unwrap();
    } catch (err) {
      console.error('Failed to approve event:', err);
    }
  };
  
  const handleRejectClick = (id: number) => {
    setRejectingEvent(id);
    setRejectionReason('');
  };
  
  const handleRejectSubmit = async () => {
    if (rejectingEvent) {
      try {
        await rejectEvent({ id: rejectingEvent, reason: rejectionReason }).unwrap();
        setRejectingEvent(null);
        setRejectionReason('');
      } catch (err) {
        console.error('Failed to reject event:', err);
      }
    }
  };

  const findVenueName = (v: number | Venue | undefined) => {
    if (!v) return 'Unknown Venue';
    if (typeof v === 'number') {
      return `Venue #${v}`;
    } else {
      return v.name || `Venue #${v.id}`;
    }
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card title="Moderation Stats">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{events.length}</div>
                  <div className="text-sm text-gray-500">Total Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-500">Approved Today</div>
                </div>
              </div>
            </Card>
            <Card title="Recent Activity">
              <div className="text-center text-gray-500 py-8">Activity tracking coming soon...</div>
            </Card>
          </div>
        );

      case 'events':
        return (
          <Card title="Events Pending Approval">
            {eventsLoading ? (
              <div className="text-center py-12 text-gray-500">Loading events...</div>
            ) : eventsError ? (
              <div className="text-center py-12 text-red-500">
                <p>Failed to load events</p>
                <pre className="text-xs mt-2 break-all">
                  {JSON.stringify(eventsError, null, 2)}
                </pre>
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <div key={event.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-purple-300">
                    {event.banner_image && (
                      <img 
                        src={event.banner_image} 
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleApprove(event.id)} 
                            className="text-green-500 hover:text-green-700 flex items-center gap-1 text-sm px-3 py-1 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectClick(event.id)} 
                            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      {rejectingEvent === event.id && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <input
                            type="text"
                            placeholder="Reason for rejection"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleRejectSubmit}
                              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                            >
                              Confirm Reject
                            </button>
                            <button
                              onClick={() => setRejectingEvent(null)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        <p className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4" />
                          Venue: {findVenueName(event.venue)}
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {event.start_datetime ? new Date(event.start_datetime).toLocaleDateString() : 'N/A'} - {event.end_datetime ? new Date(event.end_datetime).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events to review</h3>
                <p className="text-gray-500">All events have been reviewed</p>
              </div>
            )}
          </Card>
        );

      default:
        return <div className="text-center py-12 text-gray-500">Page under construction...</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={user?.fullName} />
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default ModeratorDashboard;