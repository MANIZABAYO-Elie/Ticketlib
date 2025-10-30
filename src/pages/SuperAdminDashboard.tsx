import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  BarChart3, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  User,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// ============= INTERFACES =============
interface MenuItem {
  name: string;
  icon: React.ReactNode;
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface ChartDataPoint {
  date: string;
  value: number;
}

interface TransactionItem {
  id: string;
  name: string;
  date: string;
  amount: string;
  avatar: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  activeMenu: string;
  onMenuClick: (name: string) => void;
}

interface HeaderProps {
  userName: string;
  userRole: string;
}

interface BarChartProps {
  title: string;
  data: ChartDataPoint[];
}

interface LineChartProps {
  title: string;
  data: ChartDataPoint[];
}

interface TransactionListProps {
  title: string;
  items: TransactionItem[];
}

// ============= REUSABLE COMPONENTS =============

// Logo Component
const Logo: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
      <Ticket className="w-5 h-5 text-white" />
    </div>
    <span className="text-xl font-bold text-gray-900">ticketLIB</span>
  </div>
);

// Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ menuItems, activeMenu, onMenuClick }) => (
  <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
    <div className="p-6 border-b border-gray-200">
      <Logo />
    </div>
    <nav className="flex-1 p-4">
      {menuItems.map((item) => (
        <SidebarMenuItem
          key={item.name}
          item={item}
          isActive={activeMenu === item.name}
          onClick={() => onMenuClick(item.name)}
        />
      ))}
    </nav>
  </div>
);

// Sidebar Menu Item Component
interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick: () => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ item, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    {item.icon}
    <span className="font-medium">{item.name}</span>
  </button>
);

// Header Component
const Header: React.FC<HeaderProps> = ({ userName, userRole }) => (
  <header className="bg-blue-600 text-white px-8 py-4">
    <div className="flex items-center justify-between">
      <SearchBar />
      <UserSection userName={userName} userRole={userRole} />
    </div>
  </header>
);

// Search Bar Component
const SearchBar: React.FC = () => (
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
);

// User Section Component
interface UserSectionProps {
  userName: string;
  userRole: string;
}

const UserSection: React.FC<UserSectionProps> = ({ userName, userRole }) => (
  <div className="flex items-center gap-4 ml-8">
    <NotificationButton />
    <div className="flex items-center gap-3 pl-4 border-l border-blue-400">
      <div className="text-right">
        <p className="text-sm font-medium">{userName}</p>
        <p className="text-xs text-blue-200">{userRole}</p>
      </div>
      <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
        <User className="w-5 h-5" />
      </div>
    </div>
  </div>
);

// Notification Button Component
const NotificationButton: React.FC = () => (
  <button className="relative p-2 hover:bg-blue-500 rounded-lg transition-colors">
    <Bell className="w-5 h-5" />
    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
  </button>
);

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
    <div className="flex items-center gap-1">
      {isPositive ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change} vs last month
      </span>
    </div>
  </div>
);

// Stats Grid Component
interface StatsGridProps {
  stats: StatCardProps[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    {stats.map((stat, index) => (
      <StatCard key={index} {...stat} />
    ))}
  </div>
);

// Bar Chart Component
const BarChart: React.FC<BarChartProps> = ({ title, data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="flex items-end justify-between h-64 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div 
              className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700 cursor-pointer" 
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${item.value}`}
            />
            <span className="text-xs text-gray-500">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Line Chart Component
const LineChart: React.FC<LineChartProps> = ({ title, data }) => {
  const points = data.map((item, i) => {
    const x = (i / (data.length - 1)) * 400;
    const y = 150 - (item.value / 200) * 100;
    return { x, y };
  });

  const pathD = points.map((p, i) => 
    i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`
  ).join(' ');

  const areaD = `${pathD} L 400,200 L 0,200 Z`;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="h-64 flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={pathD} fill="none" stroke="#3B82F6" strokeWidth="3" />
          <path d={areaD} fill="url(#gradient)" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3B82F6" />
          ))}
        </svg>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {data.map((item, i) => (
          <span key={i}>{item.date}</span>
        ))}
      </div>
    </div>
  );
};

// Transaction Item Component
interface TransactionItemProps {
  item: TransactionItem;
}

const TransactionItemRow: React.FC<TransactionItemProps> = ({ item }) => (
  <div className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
        {item.avatar}
      </div>
      <div>
        <p className="font-medium text-gray-900">{item.name}</p>
        <p className="text-sm text-gray-500">{item.date}</p>
      </div>
    </div>
    <span className="font-semibold text-gray-900">{item.amount}</span>
  </div>
);

// Transaction List Component
const TransactionList: React.FC<TransactionListProps> = ({ title, items }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
    <div className="space-y-4">
      {items.map((item) => (
        <TransactionItemRow key={item.id} item={item} />
      ))}
    </div>
    <button className="w-full mt-4 text-blue-600 font-medium hover:text-blue-700 transition-colors">
      View All
    </button>
  </div>
);

// Charts Grid Component
interface ChartsGridProps {
  barChartData: ChartDataPoint[];
  lineChartData: ChartDataPoint[];
}

const ChartsGrid: React.FC<ChartsGridProps> = ({ barChartData, lineChartData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <BarChart title="Event Registrations" data={barChartData} />
    <LineChart title="Ticket Sales Trend" data={lineChartData} />
  </div>
);

// Transactions Grid Component
interface TransactionsGridProps {
  recentPayments: TransactionItem[];
  transactions: TransactionItem[];
}

const TransactionsGrid: React.FC<TransactionsGridProps> = ({ recentPayments, transactions }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <TransactionList title="Recent Payments" items={recentPayments} />
    <TransactionList title="Transactions" items={transactions} />
  </div>
);

// ============= MAIN DASHBOARD COMPONENT =============
const SuperAdminDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Events', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Tickets', icon: <Ticket className="w-5 h-5" /> },
    { name: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Users', icon: <Users className="w-5 h-5" /> },
    { name: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const stats: StatCardProps[] = [
    { title: 'Total Tickets Sold', value: '220K+', change: '+12.5%', isPositive: true },
    { title: 'Total Events', value: '100+', change: '+8.2%', isPositive: true },
    { title: 'Total Revenue', value: '$50K', change: '+15.3%', isPositive: true },
    { title: 'Conversion Rate', value: '75%', change: '+3.2%', isPositive: true },
    { title: 'Total Sales', value: '$15,900', change: '-5.1%', isPositive: false },
    { title: 'Net Revenue', value: '$10,000', change: '+2.5%', isPositive: true },
  ];

  const barChartData: ChartDataPoint[] = [
    { date: 'Oct 15', value: 90 },
    { date: 'Oct 16', value: 120 },
    { date: 'Oct 17', value: 70 },
    { date: 'Oct 18', value: 150 },
    { date: 'Oct 19', value: 100 },
    { date: 'Oct 20', value: 140 },
    { date: 'Oct 21', value: 80 },
  ];

  const lineChartData: ChartDataPoint[] = [
    { date: 'Oct 15', value: 150 },
    { date: 'Oct 16', value: 120 },
    { date: 'Oct 17', value: 80 },
    { date: 'Oct 18', value: 100 },
    { date: 'Oct 19', value: 60 },
    { date: 'Oct 20', value: 90 },
    { date: 'Oct 21', value: 50 },
  ];

  const recentPayments: TransactionItem[] = [
    { id: '1', name: 'John Doe', date: 'Oct 21, 2025', amount: '$120', avatar: '👤' },
    { id: '2', name: 'Jane Smith', date: 'Oct 20, 2025', amount: '$85', avatar: '👤' },
    { id: '3', name: 'Mike Johnson', date: 'Oct 19, 2025', amount: '$150', avatar: '👤' },
  ];

  const transactions: TransactionItem[] = [
    { id: '1', name: 'Alice Brown', date: 'Oct 18, 2025', amount: '$90', avatar: '👤' },
    { id: '2', name: 'Bob Wilson', date: 'Oct 17, 2025', amount: '$200', avatar: '👤' },
    { id: '3', name: 'Emma Davis', date: 'Oct 16, 2025', amount: '$75', avatar: '👤' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        menuItems={menuItems} 
        activeMenu={activeMenu} 
        onMenuClick={setActiveMenu} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName="Admin User" userRole="Super Admin" />

        <main className="flex-1 overflow-y-auto p-8">
          <StatsGrid stats={stats} />
          <ChartsGrid barChartData={barChartData} lineChartData={lineChartData} />
          <TransactionsGrid recentPayments={recentPayments} transactions={transactions} />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;