import React, { useState } from 'react';
import { LayoutGrid, Calendar, Ticket, BarChart3, Users, Settings, Bell, User, Search } from 'lucide-react';

// Types
interface Payment {
  id: string;
  name: string;
  date: string;
  amount: number;
  avatar: string;
}

interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  avatar: string;
}

interface ChartData {
  label: string;
  value: number;
}

// Reusable Components
const Sidebar: React.FC<{ activeItem: string; onItemClick: (item: string) => void }> = ({ activeItem, onItemClick }) => {
  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', id: 'dashboard' },
    { icon: Calendar, label: 'Events', id: 'events' },
    { icon: Ticket, label: 'Tickets', id: 'tickets' },
    { icon: BarChart3, label: 'Analytics', id: 'analytics' },
    { icon: Users, label: 'Users', id: 'users' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">ticketLIB</span>
        </div>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeItem === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <div className="bg-blue-600 px-8 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-8">
        <button className="relative p-2 hover:bg-blue-700 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-white font-medium text-sm">Admin User</div>
            <div className="text-blue-200 text-xs">Super Admin</div>
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({
  title,
  children,
  action,
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

const LineChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.value / maxValue) * 80;
    return { x, y, value: d.value };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="relative h-64">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${pathD} L 100 100 L 0 100 Z`} fill="url(#gradient)" />
        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="0.5" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1" fill="#3b82f6" />
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};

const BarChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="h-64 flex items-end justify-between gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden flex items-end" style={{ height: '200px' }}>
            <div
              className="w-full bg-blue-600 rounded-t-lg transition-all duration-500"
              style={{ height: `${(d.value / maxValue) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const PaymentItem: React.FC<{ payment: Payment }> = ({ payment }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          {payment.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="font-medium text-gray-900">{payment.name}</div>
          <div className="text-sm text-gray-500">{payment.date}</div>
        </div>
      </div>
      <div className="font-semibold text-gray-900">${payment.amount}</div>
    </div>
  );
};

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          {transaction.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="font-medium text-gray-900">{transaction.name}</div>
          <div className="text-sm text-gray-500">{transaction.date}</div>
        </div>
      </div>
      <div className="font-semibold text-gray-900">${transaction.amount}</div>
    </div>
  );
};

// Main Dashboard Component
const ModeratorDashboard: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

  const ticketSalesData: ChartData[] = [
    { label: 'Oct 15', value: 500 },
    { label: 'Oct 16', value: 750 },
    { label: 'Oct 17', value: 400 },
    { label: 'Oct 18', value: 800 },
    { label: 'Oct 19', value: 600 },
    { label: 'Oct 20', value: 900 },
    { label: 'Oct 21', value: 450 },
  ];

  const eventRegistrationsData: ChartData[] = [
    { label: 'Oct 15', value: 120 },
    { label: 'Oct 16', value: 150 },
    { label: 'Oct 17', value: 90 },
    { label: 'Oct 18', value: 195 },
    { label: 'Oct 19', value: 130 },
    { label: 'Oct 20', value: 170 },
    { label: 'Oct 21', value: 110 },
  ];

  const recentPayments: Payment[] = [
    { id: '1', name: 'John Doe', date: 'Oct 21, 2025', amount: 120, avatar: '' },
    { id: '2', name: 'Jane Smith', date: 'Oct 20, 2025', amount: 85, avatar: '' },
    { id: '3', name: 'Mike Johnson', date: 'Oct 19, 2025', amount: 200, avatar: '' },
  ];

  const transactions: Transaction[] = [
    { id: '1', name: 'Alice Brown', date: 'Oct 18, 2025', amount: 90, avatar: '' },
    { id: '2', name: 'Bob Wilson', date: 'Oct 17, 2025', amount: 200, avatar: '' },
    { id: '3', name: 'Emma Davis', date: 'Oct 16, 2025', amount: 75, avatar: '' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card title="Ticket Sales Trend">
              <LineChart data={ticketSalesData} />
            </Card>
            <Card title="Event Registrations">
              <BarChart data={eventRegistrationsData} />
            </Card>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card
              title="Recent Payments"
              action={
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  View All
                </button>
              }
            >
              <div>
                {recentPayments.map(payment => (
                  <PaymentItem key={payment.id} payment={payment} />
                ))}
              </div>
            </Card>
            <Card
              title="Transactions"
              action={
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  View All
                </button>
              }
            >
              <div>
                {transactions.map(transaction => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModeratorDashboard;