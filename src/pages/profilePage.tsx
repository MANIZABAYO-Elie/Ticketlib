import React, { useState } from 'react';
import { Button } from '../components/Button';
import { ChevronRight, Moon, Bell, MessageCircle, AlertTriangle, HelpCircle, FileText, Shield, User, ChevronLeft } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [accountNotifications, setAccountNotifications] = useState(true);

  const ProfileSection = () => (
    <div className="bg-white rounded-lg p-6 mb-4">
      <h2 className="text-xl font-bold mb-4">PROFILE</h2>
      
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="text-gray-500" size={24} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Guest User</p>
            <p className="text-sm text-gray-500">you can login here</p>
          </div>
        </div>
        <ChevronRight className="text-gray-400" size={24} />
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
        <ChevronRight className="text-gray-400" size={24} />
      </div>
    </div>
  );

  const NotificationsSection = () => (
    <div className="bg-white rounded-lg p-6 mb-4">
      <h2 className="text-xl font-bold mb-4">NOTIFICATIONS</h2>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
          <p className="text-gray-900">Account Notifications</p>
          <Button
            onClick={() => setAccountNotifications(!accountNotifications)}
            className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
              accountNotifications ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                accountNotifications ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </Button>
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

export default ProfilePage;