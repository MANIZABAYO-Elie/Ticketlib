import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, LogOut, BarChart3, Calendar, Users } from 'lucide-react';
import { Button } from '../components/Button';

const Dashboard: React.FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Read user data from localStorage on mount
    const email = localStorage.getItem('email') || '';
    const fullName = localStorage.getItem('full_name') || '';
    
    setUserEmail(email);
    setUserFullName(fullName || email || 'User');

    // Redirect to login if not authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/signIn');
      return;
    }
  }, [navigate]);

  const handleSignOut = () => {
    // Remove authentication data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    localStorage.removeItem('full_name');
    localStorage.removeItem('user_id');
    
    // Dispatch event to update Header immediately
    window.dispatchEvent(new Event('user:login'));
    
    // Navigate to home page
    navigate('/');
  };

  const getInitials = (name: string): string => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell size={20} />
              </button>
              <button 
                onClick={() => navigate('/logged-in-profile')}
                className="flex items-center gap-2 p-2 text-gray-700 hover:text-gray-900"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(userFullName)}
                </div>
                <span className="hidden sm:block">{userFullName}</span>
              </button>
              <Button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {userFullName}!</h2>
          <p className="text-blue-100">{userEmail}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$45,678</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate('/events')}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calendar size={16} />
              View Events
            </Button>
            <Button
              onClick={() => navigate('/users')}
              className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Users size={16} />
              Manage Users
            </Button>
            <Button
              onClick={() => navigate('/analytics')}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <BarChart3 size={16} />
              Analytics
            </Button>
            <Button
              onClick={() => navigate('/settings')}
              className="flex items-center justify-center gap-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Settings size={16} />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;