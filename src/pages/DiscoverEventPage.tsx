import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DiscoverEventsPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 27)); // October 27, 2025
  const [viewMode, setViewMode] = useState<'Week' | 'Month'>('Week');

  const categories = [
    'Concerts',
    'Basketball',
    'Speaker sessions',
    'Volleyball',
    'Conferences',
    'Workshops',
    'Seminars',
    'Competitions',
    'Webinars',
    'Part',
    'Networking',
    'Movie'
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to 7, and shift others down by 1 for Monday start
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Previous month days
    const prevMonthDays = getDaysInMonth(new Date(year, month - 1));
    const days: (number | null)[] = [];
    
    // Add previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(prevMonthDays - i);
    }
    
    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    // Add next month's leading days to complete the grid
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push(i);
      }
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isCurrentMonth = (index: number) => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    return index >= firstDay && index < firstDay + daysInMonth;
  };

  const isToday = (day: number | null, index: number) => {
    if (!day || !isCurrentMonth(index)) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-800 to-blue-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white px-4 py-3">
            <h1 className="text-2xl font-bold text-gray-900">Discover Events</h1>
          </div>

          {/* By Date Section */}
          <div className="bg-gray-50 px-4 py-4">
            <h2 className="text-xl font-bold text-gray-600 mb-4">By date</h2>

            {/* Calendar Card */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigateMonth('prev')}
                    className="p-1 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <h3 className="text-lg font-semibold text-gray-700 min-w-[150px]">
                    {getMonthYear()}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewMode(viewMode === 'Week' ? 'Month' : 'Week')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-md text-sm"
                  >
                    {viewMode}
                  </button>
                  <button 
                    onClick={() => navigateMonth('next')}
                    className="p-1 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-gray-500 font-medium text-sm pb-2"
                  >
                    {day}
                  </div>
                ))}

                {/* Date Cells */}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className="text-center py-2"
                  >
                    {day && (
                      <span 
                        className={`text-lg font-light ${
                          isToday(day, index)
                            ? 'bg-blue-600 text-white rounded-full px-2 py-1'
                            : isCurrentMonth(index)
                            ? 'text-gray-700 hover:bg-gray-100 rounded-full px-2 py-1 cursor-pointer'
                            : 'text-gray-300'
                        }`}
                      >
                        {day}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* By Categories Section */}
          <div className="bg-gray-50 px-4 py-4">
            <h2 className="text-xl font-bold text-gray-600 mb-4">By Categories</h2>

            {/* Categories Grid */}
            <div className="grid grid-cols-4 gap-3">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="bg-white px-3 py-2 rounded-xl text-gray-800 font-medium text-sm hover:bg-gray-100 transition shadow-sm hover:shadow-md"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverEventsPage;