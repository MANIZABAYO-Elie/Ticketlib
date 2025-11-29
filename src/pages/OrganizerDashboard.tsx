

// OrganizerDashboard.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '../app/store';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../app/authSlice';
import SelectField from '../components/SelectField';
import {
  useGetEventsQuery,
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetEventStatsQuery,
  useGetVenuesQuery,
  useCreateVenueMutation,
  useUpdateVenueMutation,
  useDeleteVenueMutation,
  useSubmitEventForApprovalMutation
} from '../app/organizerApi';
import { Button } from '../components/Button';
import InputField from '../components/InputField';
import {
  LayoutGrid,
  Calendar,
  Ticket,
  BarChart3,
  Users,
  Settings,
  Bell,
  User,
  Search,
  Plus,
  MapPin,
  Trash2,
  LogOut
} from 'lucide-react';

// Local types matching your organizerApi
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

// -------------------------
// Sidebar
// -------------------------
const Sidebar: React.FC<{ activeItem: string; onItemClick: (item: string) => void }> = ({ activeItem, onItemClick }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', id: 'dashboard' },
    { icon: Calendar, label: 'My Events', id: 'events' },
    { icon: Ticket, label: 'Venues', id: 'venues' },
    { icon: Users, label: 'Bookings', id: 'bookings' },
    { icon: BarChart3, label: 'Analytics', id: 'analytics' },
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

// -------------------------
// Header
// -------------------------
const Header: React.FC<{ userName?: string }> = ({ userName }) => {
  return (
    <div className="bg-blue-600 px-8 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-2xl relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <div className="flex items-center gap-4 ml-8">
        <button className="relative p-2 hover:bg-blue-700 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-white font-medium text-sm">{userName || 'Organizer'}</div>
            <div className="text-blue-200 text-xs">Event Organizer</div>
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------
// Card
// -------------------------
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

// -------------------------
// Venues Management
// -------------------------
const VenuesManagement: React.FC = () => {
  const { data: venuesData, isLoading, error } = useGetVenuesQuery();
  const [createVenue, { isLoading: creating }] = useCreateVenueMutation();
  const [updateVenue, { isLoading: updating }] = useUpdateVenueMutation();
  const [deleteVenue] = useDeleteVenueMutation();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; venue: Venue | null }>({ show: false, venue: null });

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    capacity: '',
    google_maps_url: '',
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    capacity: '',
    google_maps_url: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVenue({
        name: formData.name,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        capacity: parseInt(formData.capacity || '0'),
        google_maps_url: formData.google_maps_url || '',
      }).unwrap();
      setFormData({ name: '', address: '', city: '', country: '', capacity: '', google_maps_url: '' });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create venue:', err);
    }
  };

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue.id);
    setEditFormData({
      name: venue.name || '',
      address: venue.address || '',
      city: venue.city || '',
      country: venue.country || '',
      capacity: venue.capacity?.toString() || '',
      google_maps_url: venue.google_maps_url || '',
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVenue) return;
    try {
      await updateVenue({
        id: editingVenue,
        data: {
          name: editFormData.name,
          address: editFormData.address,
          city: editFormData.city,
          country: editFormData.country,
          capacity: parseInt(editFormData.capacity || '0'),
          google_maps_url: editFormData.google_maps_url || '',
        },
      }).unwrap();
      setEditingVenue(null);
    } catch (err) {
      console.error('Failed to update venue:', err);
    }
  };

  const handleDeleteClick = (venue: Venue) => {
    setDeleteConfirm({ show: true, venue });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.venue) return;
    try {
      await deleteVenue(deleteConfirm.venue.id).unwrap();
      setDeleteConfirm({ show: false, venue: null });
    } catch (err) {
      console.error('Failed to delete venue:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, venue: null });
  };

  // API returns { data: Venue[] }
  const venues: Venue[] = (venuesData && (venuesData as any).data) ? (venuesData as any).data : [];

  return (
    <Card
      title="Venues Management"
      action={
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create Venue
        </Button>
      }
    >
      {showCreateForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Create New Venue</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="name" placeholder="Venue Name" value={formData.name} onChange={handleInputChange} required />
            <InputField name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} required />
            <InputField name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
            <InputField name="country" placeholder="Country" value={formData.country} onChange={handleInputChange} required />
            <InputField type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleInputChange} required />
            <InputField name="google_maps_url" placeholder="Google Maps URL" value={formData.google_maps_url} onChange={handleInputChange} />
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={creating} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50">
                {creating ? 'Creating...' : 'Create Venue'}
              </Button>
              <Button type="button" onClick={() => setShowCreateForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading venues...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-red-600 font-medium">Failed to load venues</div>
          <div className="text-red-500 text-sm mt-1">{JSON.stringify(error)}</div>
        </div>
      ) : venues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div key={venue.id}>
              {editingVenue === venue.id ? (
                <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Edit Venue</h3>
                  <form onSubmit={handleUpdateSubmit} className="space-y-3">
                    <InputField name="name" placeholder="Venue Name" value={editFormData.name} onChange={handleEditInputChange} required />
                    <InputField name="address" placeholder="Address" value={editFormData.address} onChange={handleEditInputChange} required />
                    <InputField name="city" placeholder="City" value={editFormData.city} onChange={handleEditInputChange} required />
                    <InputField name="country" placeholder="Country" value={editFormData.country} onChange={handleEditInputChange} required />
                    <InputField type="number" name="capacity" placeholder="Capacity" value={editFormData.capacity} onChange={handleEditInputChange} required />
                    <InputField name="google_maps_url" placeholder="Google Maps URL" value={editFormData.google_maps_url} onChange={handleEditInputChange} />
                    <div className="flex gap-2">
                      <Button type="submit" disabled={updating} className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50">
                        {updating ? 'Updating...' : 'Update'}
                      </Button>
                      <Button type="button" onClick={() => setEditingVenue(null)} className="bg-gray-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{venue.name}</h3>
                        <p className="text-sm text-gray-500">Venue #{venue.id}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-600">
                        <p>{venue.address}</p>
                        <p className="font-medium">{venue.city}, {venue.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Capacity: <span className="font-semibold text-gray-900">{venue.capacity?.toLocaleString ? venue.capacity.toLocaleString() : venue.capacity || 'N/A'}</span> people
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Created: {venue.created_at ? new Date(venue.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    {venue.google_maps_url && (
                      <a href={venue.google_maps_url} target="_blank" rel="noopener noreferrer" className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                        Maps
                      </a>
                    )}
                    <button onClick={() => handleEdit(venue)} className="bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(venue)} className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No venues yet</h3>
          <p className="text-gray-500 mb-6">Create your first venue to start organizing events</p>
          <Button onClick={() => setShowCreateForm(true)} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Create Your First Venue
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Venue</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.venue?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={handleDeleteCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

// -------------------------
// Organizer Dashboard Main Component
// -------------------------
const OrganizerDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth || {});
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    category: '',
    start_datetime: '',
    end_datetime: '',
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Queries & mutations (matches your organizerApi)
  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useGetEventsQuery();
  const { data: venuesData } = useGetVenuesQuery();
  const { data: stats } = useGetEventStatsQuery();
  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const [submitForApproval] = useSubmitEventForApprovalMutation();

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
      if (bannerFile) {
        eventData.append('banner_image', bannerFile);
      }
      
      await createEvent(eventData as any).unwrap();
      setFormData({ title: '', description: '', venue: '', start_datetime: '', end_datetime: '' });
      setBannerFile(null);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const idNum = typeof id === 'string' ? parseInt(id) : id;
      await deleteEvent(idNum).unwrap();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };
  
  const handleSubmitForApproval = async (id: number) => {
    if (window.confirm('Submit this event for approval?')) {
      try {
        await submitForApproval(id).unwrap();
      } catch (error) {
        console.error('Failed to submit event for approval:', error);
      }
    }
  };

  // API shapes: eventsData.results (EventsResponse), venuesData.data (VenuesResponse)
  const venues: Venue[] = (venuesData && (venuesData as any).data) ? (venuesData as any).data : [];
  const events: EventItem[] = (eventsData && (eventsData as any).results) ? (eventsData as any).results : [];

  // Debug logs (remove in prod)
  // eslint-disable-next-line no-console
  console.log('eventsLoading', eventsLoading);
  // eslint-disable-next-line no-console
  console.log('eventsData', eventsData);
  if (eventsError) {
    // eslint-disable-next-line no-console
    console.error('eventsError', eventsError);
  }
  // eslint-disable-next-line no-console
  console.log('extracted events length', events.length);

  const findVenueName = (v: number | Venue | undefined) => {
    if (!v) return 'Unknown Venue';
    if (typeof v === 'number') {
      const found = venues.find(x => x.id === v);
      return found?.name || `Venue #${v}`;
    } else {
      return v.name || `Venue #${v.id}`;
    }
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card title="Event Performance">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats?.total_events ?? events.length ?? 0}</div>
                  <div className="text-sm text-gray-500">Total Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats?.active_events ?? 0}</div>
                  <div className="text-sm text-gray-500">Active Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats?.total_bookings ?? 0}</div>
                  <div className="text-sm text-gray-500">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">${stats?.total_revenue ?? 0}</div>
                  <div className="text-sm text-gray-500">Revenue</div>
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
          <Card
            title="My Events"
            action={
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Create Event
              </Button>
            }
          >
            {showCreateForm && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                    <InputField name="title" placeholder="Summer Music Festival" value={formData.title} onChange={handleInputChange} required />
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
                      {venues.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.name} - {v.city}, {v.country}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                    <InputField type="datetime-local" name="start_datetime" value={formData.start_datetime} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                    <InputField type="datetime-local" name="end_datetime" value={formData.end_datetime} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                    <input
                      type="file"
                      name="banner_image"
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      placeholder="Annual summer music festival"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button type="submit" disabled={creating} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50">
                      {creating ? 'Creating...' : 'Create Event'}
                    </Button>
                    <Button type="button" onClick={() => setShowCreateForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {eventsLoading ? (
              <div className="text-center py-12 text-gray-500">Loading events...</div>
            ) : eventsError ? (
              <div className="text-center py-12 text-red-500">
                <p>Failed to load events</p>
                <pre className="text-xs mt-2 break-all">
                  {eventsError
                    ? JSON.stringify({
                        status: (eventsError as any).status,
                        message: (eventsError as any).data || (eventsError as any).error || (eventsError as any).message,
                      }, null, 2)
                    : 'Unknown error'}
                </pre>
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <div key={event.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-blue-300">
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
                            onClick={() => handleSubmitForApproval(event.id)}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            Submit for Approval
                          </button>
                          <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-500 mb-6">Create your first event to get started</p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Your First Event
                </Button>
              </div>
            )}
          </Card>
        );

      case 'venues':
        return <VenuesManagement />;

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

export default OrganizerDashboard;


// // src/features/OrganizerDashboard/OrganizerDashboard.tsx
// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { type RootState } from '../app/store';
// import { useAppDispatch } from '../app/hooks';
// import { logout } from '../app/authSlice';
// import {
//   useGetEventsQuery,
//   useCreateEventMutation,
//   useDeleteEventMutation,
//   useGetEventStatsQuery,
//   useGetVenuesQuery,
//   useCreateVenueMutation,
//   useUpdateVenueMutation,
//   useDeleteVenueMutation,
// } from '../app/organizerApi';
// import { Button } from '../components/Button';
// import InputField from '../components/InputField';
// import {
//   LayoutGrid,
//   Calendar,
//   Ticket,
//   BarChart3,
//   Users,
//   Settings,
//   Bell,
//   User,
//   Search,
//   Plus,
//   MapPin,
//   Trash2,
//   LogOut,
// } from 'lucide-react';

// // Local types (reused for component)
// type Venue = {
//   id: number;
//   name: string;
//   address: string;
//   city: string;
//   country: string;
//   capacity: number;
//   created_at: string;
//   google_maps_url?: string | null;
// };

// type EventItem = {
//   id: number;
//   title: string;
//   description: string;
//   banner_image?: string | null;
//   tags?: string[] | { id: number; name: string }[];
//   start_datetime: string | null;
//   end_datetime: string | null;
//   venue: number | Venue;
//   venue_name?: string;
//   category?: string[] | { id: number; name: string }[] | null;
//   created_at?: string;
// };

// // -------------------------
// // Sidebar
// // -------------------------
// const Sidebar: React.FC<{ activeItem: string; onItemClick: (item: string) => void }> = ({ activeItem, onItemClick }) => {
//   const dispatch = useAppDispatch();
//   const handleLogout = () => {
//     dispatch(logout());
//     // navigation handled outside in your app router
//   };

//   const menuItems = [
//     { icon: LayoutGrid, label: 'Dashboard', id: 'dashboard' },
//     { icon: Calendar, label: 'My Events', id: 'events' },
//     { icon: Ticket, label: 'Venues', id: 'venues' },
//     { icon: Users, label: 'Bookings', id: 'bookings' },
//     { icon: BarChart3, label: 'Analytics', id: 'analytics' },
//     { icon: Settings, label: 'Settings', id: 'settings' },
//   ];

//   return (
//     <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
//       <div className="p-6 border-b border-gray-200 flex items-center gap-2">
//         <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//           <Ticket className="w-5 h-5 text-white" />
//         </div>
//         <span className="font-bold text-xl">ticketLIB</span>
//       </div>
//       <nav className="flex-1 p-4">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <button
//               key={item.id}
//               onClick={() => onItemClick(item.id)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
//                 activeItem === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
//               }`}
//             >
//               <Icon className="w-5 h-5" />
//               <span className="font-medium">{item.label}</span>
//             </button>
//           );
//         })}
//       </nav>

//       <div className="p-4 border-t border-gray-200">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//         >
//           <LogOut className="w-5 h-5" />
//           <span className="font-medium">Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// // -------------------------
// // Header
// // -------------------------
// const Header: React.FC<{ userName?: string }> = ({ userName }) => {
//   return (
//     <div className="bg-blue-600 px-8 py-4 flex items-center justify-between">
//       <div className="flex-1 max-w-2xl relative">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//         <input
//           type="text"
//           placeholder="Search..."
//           className="w-full pl-10 pr-4 py-2 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
//         />
//       </div>
//       <div className="flex items-center gap-4 ml-8">
//         <button className="relative p-2 hover:bg-blue-700 rounded-lg transition-colors">
//           <Bell className="w-5 h-5 text-white" />
//           <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//         </button>
//         <div className="flex items-center gap-3">
//           <div className="text-right">
//             <div className="text-white font-medium text-sm">{userName || 'Organizer'}</div>
//             <div className="text-blue-200 text-xs">Event Organizer</div>
//           </div>
//           <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
//             <User className="w-6 h-6 text-white" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // -------------------------
// // Reusable Card
// // -------------------------
// const Card: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({
//   title,
//   children,
//   action,
// }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-lg font-bold text-gray-900">{title}</h2>
//         {action}
//       </div>
//       {children}
//     </div>
//   );
// };

// // -------------------------
// // VenuesManagement (kept simple)
// // -------------------------
// const VenuesManagement: React.FC = () => {
//   const { data: venuesData, isLoading, error } = useGetVenuesQuery();
//   const [createVenue] = useCreateVenueMutation();
//   const [updateVenue] = useUpdateVenueMutation();
//   const [deleteVenue] = useDeleteVenueMutation();

//   const venues: Venue[] = venuesData?.data ?? [];

//   // Minimal UI for listing venues
//   return (
//     <Card title="Venues Management" action={<div />}>
//       {isLoading ? (
//         <div>Loading venues...</div>
//       ) : error ? (
//         <div>Error loading venues: {JSON.stringify(error)}</div>
//       ) : venues.length === 0 ? (
//         <div>No venues yet</div>
//       ) : (
//         <div className="grid grid-cols-1 gap-4">
//           {venues.map((v) => (
//             <div key={v.id} className="p-4 border rounded">
//               <div className="flex justify-between">
//                 <div>
//                   <div className="font-semibold">{v.name}</div>
//                   <div className="text-sm text-gray-500">
//                     {v.city}, {v.country}
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-600">Capacity: {v.capacity}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </Card>
//   );
// };

// // -------------------------
// // OrganizerDashboard
// // -------------------------
// const OrganizerDashboard: React.FC = () => {
//   const { user } = useSelector((state: RootState) => state.auth || {});
//   const [activeMenuItem, setActiveMenuItem] = useState<'dashboard' | 'events' | 'venues' | string>('dashboard');
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     venue: '',
//     start_datetime: '',
//     end_datetime: '',
//   });

//   // API hooks
//   const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useGetEventsQuery();
//   const { data: venuesData } = useGetVenuesQuery();
//   const { data: stats } = useGetEventStatsQuery();
//   const [createEvent, { isLoading: creating }] = useCreateEventMutation();
//   const [deleteEvent] = useDeleteEventMutation();

//   // Derived arrays
//   const venues: Venue[] = venuesData?.data ?? [];
//   const events: EventItem[] = eventsData?.results ?? [];

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await createEvent({
//         title: formData.title,
//         description: formData.description,
//         venue: parseInt(formData.venue || '0', 10),
//         start_datetime: formData.start_datetime,
//         end_datetime: formData.end_datetime,
//       }).unwrap();
//       setFormData({ title: '', description: '', venue: '', start_datetime: '', end_datetime: '' });
//       setShowCreateForm(false);
//     } catch (err) {
//       console.error('Failed to create event:', err);
//       // Optionally surface UI error state
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Are you sure you want to delete this event?')) return;
//     try {
//       await deleteEvent(id).unwrap();
//     } catch (err) {
//       console.error('Failed to delete event:', err);
//     }
//   };

//   const findVenueName = (v: number | Venue | undefined) => {
//     if (!v) return 'Unknown Venue';
//     if (typeof v === 'number') {
//       const found = venues.find((x) => x.id === v);
//       return found?.name || `Venue #${v}`;
//     } else {
//       return v.name || `Venue #${v.id}`;
//     }
//   };

//   const renderContent = () => {
//     switch (activeMenuItem) {
//       case 'dashboard':
//         return (
//           <div className="grid grid-cols-2 gap-6 mb-6">
//             <Card title="Event Performance">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-blue-600">{stats?.total_events ?? events.length ?? 0}</div>
//                   <div className="text-sm text-gray-500">Total Events</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-green-600">{stats?.active_events ?? 0}</div>
//                   <div className="text-sm text-gray-500">Active Events</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-purple-600">{stats?.total_bookings ?? 0}</div>
//                   <div className="text-sm text-gray-500">Total Bookings</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-yellow-600">${stats?.total_revenue ?? 0}</div>
//                   <div className="text-sm text-gray-500">Revenue</div>
//                 </div>
//               </div>
//             </Card>
//             <Card title="Recent Activity">
//               <div className="text-center text-gray-500 py-8">Activity tracking coming soon...</div>
//             </Card>
//           </div>
//         );

//       case 'events':
//         return (
//           <Card
//             title="My Events"
//             action={
//               <Button onClick={() => setShowCreateForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2">
//                 <Plus className="h-4 w-4" /> Create Event
//               </Button>
//             }
//           >
//             {showCreateForm && (
//               <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
//                 <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
//                 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
//                     <InputField name="title" placeholder="Summer Music Festival" value={formData.title} onChange={handleInputChange} required />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
//                     <select
//                       name="venue"
//                       value={formData.venue}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="">Select Venue</option>
//                       {venues.map((v) => (
//                         <option key={v.id} value={v.id}>
//                           {v.name} - {v.city}, {v.country}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
//                     <InputField type="datetime-local" name="start_datetime" value={formData.start_datetime} onChange={handleInputChange} required />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
//                     <InputField type="datetime-local" name="end_datetime" value={formData.end_datetime} onChange={handleInputChange} required />
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                     <textarea
//                       name="description"
//                       placeholder="Annual summer music festival"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       rows={3}
//                       required
//                     />
//                   </div>
//                   <div className="md:col-span-2 flex gap-2">
//                     <Button type="submit" disabled={creating} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50">
//                       {creating ? 'Creating...' : 'Create Event'}
//                     </Button>
//                     <Button type="button" onClick={() => setShowCreateForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
//                       Cancel
//                     </Button>
//                   </div>
//                 </form>
//               </div>
//             )}

//             {eventsLoading ? (
//               <div className="text-center py-12 text-gray-500">Loading events...</div>
//             ) : eventsError ? (
//               <div className="text-center py-12 text-red-500">
//                 <p>Failed to load events</p>
//                 <pre className="text-xs mt-2 break-all">
//                   {eventsError
//                     ? JSON.stringify(
//                         {
//                           status: (eventsError as any).status,
//                           message: (eventsError as any).data || (eventsError as any).error || (eventsError as any).message,
//                         },
//                         null,
//                         2,
//                       )
//                     : 'Unknown error'}
//                 </pre>
//               </div>
//             ) : events && events.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {events.map((event) => (
//                   <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
//                       <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:text-red-700">
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </div>
//                     <p className="text-sm text-gray-600 mb-2">{event.description}</p>
//                     <div className="text-sm text-gray-500">
//                       <p className="flex items-center gap-2 mb-1">
//                         <MapPin className="w-4 h-4" />
//                         Venue: {findVenueName(event.venue)}
//                       </p>
//                       <p className="flex items-center gap-2">
//                         <Calendar className="w-4 h-4" />
//                         {event.start_datetime ? new Date(event.start_datetime).toLocaleString() : 'N/A'} - {event.end_datetime ? new Date(event.end_datetime).toLocaleString() : 'N/A'}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12 text-gray-500">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Calendar className="w-8 h-8 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
//                 <p className="text-gray-500 mb-6">Create your first event to get started</p>
//                 <Button onClick={() => setShowCreateForm(true)} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
//                   Create Your First Event
//                 </Button>
//               </div>
//             )}
//           </Card>
//         );

//       case 'venues':
//         return <VenuesManagement />;

//       default:
//         return <div className="text-center py-12 text-gray-500">Page under construction...</div>;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header userName={user?.fullName} />
//         <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
//       </div>
//     </div>
//   );
// };

// export default OrganizerDashboard;







