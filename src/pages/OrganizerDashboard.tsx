import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../app/store';
import { useGetEventsQuery, useCreateEventMutation, useDeleteEventMutation, useGetEventStatsQuery } from '../app/organizerApi';
import { Button } from '../components/Button';
import InputField from '../components/InputField';
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { Plus, Calendar, MapPin, Users, DollarSign, Trash2, Edit, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';

const OrganizerDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    capacity: '',
  });

  const { data: events, isLoading: eventsLoading } = useGetEventsQuery();
  const { data: stats } = useGetEventStatsQuery();
  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: RiDashboardHorizontalLine },
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
      }).unwrap();
      setFormData({ title: '', description: '', date: '', location: '', price: '', capacity: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id).unwrap();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.total_events || events?.length || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.total_bookings || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats?.total_revenue || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Events</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.active_events || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'events':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
            </div>

            {/* Create Event Form */}
            {showCreateForm && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    name="title"
                    placeholder="Event Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    type="datetime-local"
                    name="date"
                    placeholder="Event Date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="md:col-span-2">
                    <textarea
                      name="description"
                      placeholder="Event Description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button
                      type="submit"
                      disabled={creating}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      {creating ? 'Creating...' : 'Create Event'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Events List */}
            {eventsLoading ? (
              <div className="text-center py-8">Loading events...</div>
            ) : events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{event.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.status === 'published' ? 'bg-green-100 text-green-800' :
                        event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        ${event.price}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event.capacity} capacity
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No events found. Create your first event to get started!
              </div>
            )}
          </div>
        );
      
      case 'bookings':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h2>
            <div className="text-center py-8 text-gray-500">
              Bookings management coming soon...
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
            <div className="text-center py-8 text-gray-500">
              Settings panel coming soon...
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Organizer</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Organizer Dashboard</h1>
            <div></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <p className="text-gray-600">Welcome back, {user?.full_name}</p>
          </div>
          
          {renderContent()}
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default OrganizerDashboard;