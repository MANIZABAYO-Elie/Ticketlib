import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Moon, Bell, MessageCircle, AlertTriangle, HelpCircle, FileText, Shield, ChevronLeft, User, Edit, LogOut } from 'lucide-react';
import { Button } from '../components/Button';
import { useLogoutMutation } from '../app/authApi';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../app/authSlice';

const LoggedInProfilePage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();
  
  // Get user data from Redux
  const { user } = useAppSelector((state) => state.auth);
  const userEmail = user?.email || '';
  const userFullName = user?.fullName || user?.email || 'User';

  // Generate initials from full name or email
  const getInitials = (name: string): string => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSignOut = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      dispatch(logout());
      navigate('/');
    }
  };

  const ProfileSection = () => (
    <div className="bg-white rounded-lg p-6 mb-4">
      <h2 className="text-xl font-bold mb-6">PROFILE</h2>
      
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
        <div className="flex flex-col items-center flex-1">
          <div className="w-20 h-20 bg-blue-600 rounded-full mb-3 flex items-center justify-center">
            <span className="text-white text-xl font-bold">{getInitials(userFullName)}</span>
          </div>
          <p className="font-semibold text-gray-900">{userFullName}</p>
          <p className="text-sm text-gray-600">{userEmail}</p>
        </div>
        <ChevronRight className="text-gray-400" size={24} />
      </div>
      
      <div className="flex gap-3 mt-4">
        <Button
          onClick={() => navigate('/edit-profile')}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit size={16} />
          Edit Profile
        </Button>
        <Button
          onClick={handleSignOut}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    </div>
  );

  const DisplaySection = () => (
    <div className="bg-white rounded-lg p-6 mb-4">
      <h2 className="text-xl font-bold mb-4">DISPLAY</h2>
      
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
        <div className="flex items-center gap-3">
          <Moon size={20} className="text-gray-700" />
          <span className="text-gray-900">Theme</span>
        </div>
        <Button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
            darkMode ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
              darkMode ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </Button>
      </div>
    </div>
  );

  const NotificationsSection = () => (
    <div className="bg-white rounded-lg p-6 mb-4">
      <h2 className="text-xl font-bold mb-4">NOTIFICATIONS</h2>
      
      <div className="space-y-2">
        <div className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <p className="text-gray-900">Account Notifications</p>
        </div>
        <div className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <p className="text-gray-900">Promotions</p>
        </div>
        <div className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <Bell size={20} className="text-gray-700" />
          <span className="text-gray-900">Announcements</span>
        </div>
      </div>
    </div>
  );

  const AccountSection = () => (
    <div className="bg-white rounded-lg p-6 mb-4">
      <h2 className="text-xl font-bold mb-4">ACCOUNT</h2>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <MessageCircle size={20} className="text-gray-700" />
            <span className="text-gray-900">Contact us</span>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </div>
        
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-gray-700" />
            <span className="text-gray-900">Report a problem</span>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </div>
        
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <HelpCircle size={20} className="text-gray-700" />
            <span className="text-gray-900">FAQs</span>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </div>
        
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-gray-700" />
            <span className="text-gray-900">Terms & Conditions</span>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </div>
        
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-gray-700" />
            <span className="text-gray-900">Privacy & Policies</span>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl h-[90vh] mx-auto bg-white rounded-xl shadow-md overflow-hidden overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white text-center py-6 lg:py-8 rounded-t-xl relative">
          <button 
            onClick={() => navigate('/')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 hover:bg-blue-600 p-2 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">Profile</h1>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
          <ProfileSection />
          <DisplaySection />
          <NotificationsSection />
          <AccountSection />
        </div>
      </div>
    </div>
  );
};

export default LoggedInProfilePage;