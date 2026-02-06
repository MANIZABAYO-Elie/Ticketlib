import React, { useState } from 'react';
import { 
  useGetPendingEventsQuery, 
  useApproveEventMutation, 
  useRejectEventMutation 
} from '../app/organizerApi';
import StatusBadge from '../components/StatusBadge';
import { Button } from '../components/Button';
import Toast from '../components/Toast';
import {
  Calendar,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface EventItem {
  id: number;
  title: string;
  description: string;
  banner_image?: string | null;
  start_datetime: string | null;
  end_datetime: string | null;
  venue: any;
  organizer_name?: string;
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
  submitted_at?: string;
  category?: string;
}

const AdminApprovalPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'submittedAt' | 'title' | 'organizer'>('submittedAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectingEvent, setRejectingEvent] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  
  const { data: eventsData, isLoading, error } = useGetPendingEventsQuery();
  const [approveEvent, { isLoading: approving }] = useApproveEventMutation();
  const [rejectEvent, { isLoading: rejecting }] = useRejectEventMutation();

  const events: EventItem[] = eventsData?.results || [];
  const itemsPerPage = 6;

  // Filter and sort events
  const filteredEvents = events
    .filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'organizer':
          return (a.organizer_name || '').localeCompare(b.organizer_name || '');
        case 'submittedAt':
        default:
          return new Date(b.submitted_at || '').getTime() - new Date(a.submitted_at || '').getTime();
      }
    });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = async (id: number) => {
    try {
      await approveEvent(id).unwrap();
      setToast({ message: 'Event approved successfully!', type: 'success' });
    } catch (err) {
      console.error('Failed to approve event:', err);
      setToast({ message: 'Failed to approve event. Please try again.', type: 'error' });
    }
  };

  const handleRejectClick = (id: number) => {
    setRejectingEvent(id);
    setRejectionReason('');
  };

  const handleRejectSubmit = async () => {
    if (rejectingEvent && rejectionReason.trim()) {
      try {
        await rejectEvent({ id: rejectingEvent, reason: rejectionReason }).unwrap();
        setRejectingEvent(null);
        setRejectionReason('');
        setToast({ message: 'Event rejected successfully.', type: 'success' });
      } catch (err) {
        console.error('Failed to reject event:', err);
        setToast({ message: 'Failed to reject event. Please try again.', type: 'error' });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Failed to load events</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Event Approvals</h1>
          <p className="text-gray-600 mt-1">Review and approve pending events</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events, organizers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="submittedAt">Sort by Submission Date</option>
                <option value="title">Sort by Title</option>
                <option value="organizer">Sort by Organizer</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {paginatedEvents.length} of {filteredEvents.length} events
          </div>
        </div>

        {/* Events Grid */}
        {paginatedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedEvents.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                {event.banner_image && (
                  <img 
                    src={event.banner_image} 
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
                    <StatusBadge status={event.status} />
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {event.organizer_name && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{event.organizer_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {event.start_datetime 
                          ? new Date(event.start_datetime).toLocaleDateString() 
                          : 'Date TBA'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {typeof event.venue === 'object' ? event.venue.name : `Venue #${event.venue}`}
                      </span>
                    </div>
                    {event.submitted_at && (
                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(event.submitted_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {rejectingEvent === event.id ? (
                    <div className="space-y-3">
                      <textarea
                        placeholder="Reason for rejection (required)"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleRejectSubmit}
                          disabled={!rejectionReason.trim() || rejecting}
                          className="flex-1 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {rejecting ? 'Rejecting...' : 'Confirm Reject'}
                        </Button>
                        <Button
                          onClick={() => setRejectingEvent(null)}
                          className="flex-1 bg-gray-300 text-gray-700 hover:bg-gray-400"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(event.id)}
                        disabled={approving}
                        className="flex-1 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {approving ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button
                        onClick={() => handleRejectClick(event.id)}
                        className="flex-1 bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending events</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No events match your search criteria.' : 'All events have been reviewed.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Toast Notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminApprovalPage;