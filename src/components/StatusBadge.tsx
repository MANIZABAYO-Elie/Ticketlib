import React from 'react';
import { CheckCircle, Clock, XCircle, FileText } from 'lucide-react';

interface StatusBadgeProps {
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'draft', className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          text: 'Approved',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'rejected':
        return {
          icon: XCircle,
          text: 'Rejected',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          icon: FileText,
          text: 'Draft',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-full ${config.className} ${className}`}>
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
};

export default StatusBadge;