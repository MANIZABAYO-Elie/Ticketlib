import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../app/store';
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
  TrendingDown,
  Plus,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { useCreateUserMutation, useGetUsersListQuery, useLogoutMutation } from '../app/authApi';
import { useGetEventsQuery, useCreateEventMutation, useGetVenuesQuery, useCreateVenueMutation, useGetCategoriesQuery, useCreateCategoryMutation, useGetTagsQuery, useCreateTagMutation } from '../app/organizerApi';
import { useGetAllQuery } from '../features/countries/countriesApi';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

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
  onLogout: () => void;
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
const Sidebar: React.FC<SidebarProps> = ({ menuItems, activeMenu, onMenuClick, onLogout }) => (
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
    <div className="p-4 border-t border-gray-200">
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
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

// Users List Component
const UsersList: React.FC = () => {
  const { data: usersData, isLoading, error } = useGetUsersListQuery();
  
  if (isLoading) return <div className="text-center py-4">Loading users...</div>;
  if (error) return <div className="text-red-600 text-center py-4">Error loading users</div>;
  
  const users = usersData?.data || usersData || [];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Users List</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.full_name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'organizer' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'moderator' ? 'bg-yellow-100 text-yellow-800' :
                    user.role === 'support_staff' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.phone || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.your_country || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Users Management Component
const UsersManagement: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create User
        </Button>
      </div>
      
      <div className={`transition-opacity duration-300 ${showCreateForm ? 'opacity-30' : 'opacity-100'}`}>
        <UsersList />
      </div>
      
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <CreateUserForm onSuccess={() => setShowCreateForm(false)} onCancel={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

// Create User Form Component
interface CreateUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'customer',
    phone: '',
    your_country: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [createUser, { isLoading }] = useCreateUserMutation();
  const { data: countries, isLoading: countriesLoading } = useGetAllQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await createUser(formData).unwrap();
      setSuccessMessage('User created successfully!');
      setFormData({
        email: '',
        full_name: '',
        password: '',
        role: 'customer',
        phone: '',
        your_country: ''
      });
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <InputField
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <InputField
              type="text"
              name="full_name"
              placeholder="Enter full name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <InputField
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <SelectField
            label="User Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={['customer', 'organizer', 'moderator', 'support_staff', 'admin']}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <InputField
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              name="your_country"
              value={formData.your_country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Country</option>
              {countries?.map((country) => (
                <option key={country.cca2} value={country.cca2}>
                  {country.name.common}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating User...' : 'Create User'}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Venues Management Component
const VenuesManagement: React.FC = () => {
  const { data: venuesData, isLoading, error } = useGetVenuesQuery();
  const venues = (venuesData && (venuesData as any).data) ? (venuesData as any).data : [];
  const [createVenue, { isLoading: creating }] = useCreateVenueMutation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
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
        capacity: parseInt(formData.capacity),
        google_maps_url: formData.google_maps_url,
      }).unwrap();
      setFormData({ name: '', address: '', city: '', country: '', capacity: '', google_maps_url: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create venue:', error);
    }
  };
  
  if (isLoading) return <div className="text-center py-4">Loading venues...</div>;
  if (error) return <div className="text-red-600 text-center py-4">Error loading venues</div>;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Venues Management</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total: {venues.length} venues
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Venue
          </Button>
        </div>
      </div>
      
      {showCreateForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Create New Venue</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="name"
              placeholder="Venue Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <InputField
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <InputField
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            <InputField
              name="country"
              placeholder="Country"
              value={formData.country}
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
            <InputField
              name="google_maps_url"
              placeholder="Google Maps URL"
              value={formData.google_maps_url}
              onChange={handleInputChange}
            />
            <div className="md:col-span-2 flex gap-2">
              <Button
                type="submit"
                disabled={creating}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Venue'}
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
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {venues.map((venue: any) => (
                <tr key={venue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {venue.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{venue.address}</div>
                    <div className="text-sm text-gray-500">{venue.city}, {venue.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {venue.capacity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(venue.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Tags Management Component
const TagsManagement: React.FC = () => {
  const { data: tagsData, isLoading, error } = useGetTagsQuery();
  const [createTag, { isLoading: creating }] = useCreateTagMutation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTag({ name: formData.name }).unwrap();
      setFormData({ name: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };
  
  if (isLoading) return <div className="text-center py-4">Loading tags...</div>;
  if (error) return <div className="text-red-600 text-center py-4">Error loading tags</div>;
  
  const tags = tagsData?.results || [];
  const totalCount = tagsData?.count || 0;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tags Management</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">Total: {totalCount} tags</div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Tag
          </Button>
        </div>
      </div>
      
      {showCreateForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Create New Tag</h3>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <InputField
              name="name"
              placeholder="Tag Name (e.g., Music, Sports, Technology)"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Button
              type="submit"
              disabled={creating}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </Button>
            <Button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Button>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tags.map((tag: any) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tag.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {tag.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tag.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {tagsData && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {tags.length} of {totalCount} tags
            </div>
            <div className="flex items-center gap-2">
              {tagsData.previous && (
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Previous
                </button>
              )}
              {tagsData.next && (
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Categories Management Component
const CategoriesManagement: React.FC = () => {
  const { data: categoriesData, isLoading, error } = useGetCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory({
        name: formData.name,
        description: formData.description,
      }).unwrap();
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };
  
  if (isLoading) return <div className="text-center py-4">Loading categories...</div>;
  if (error) return <div className="text-red-600 text-center py-4">Error loading categories</div>;
  
  const categories = categoriesData?.results || [];
  const totalCount = categoriesData?.count || 0;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total: {totalCount} categories
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>
      </div>
      
      {showCreateForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Create New Category</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="name"
              placeholder="Category Name (e.g., Concert, Sports, Festival)"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <div className="md:col-span-2">
              <textarea
                name="description"
                placeholder="Category Description"
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
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Category'}
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
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category: any) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate">{category.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        {categoriesData && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {categories.length} of {totalCount} categories
            </div>
            <div className="flex items-center gap-2">
              {categoriesData.previous && (
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Previous
                </button>
              )}
              {categoriesData.next && (
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Events Management Component
const EventsManagement: React.FC = () => {
  const { data: eventsData, isLoading, error, refetch } = useGetEventsQuery();
  const { data: venues } = useGetVenuesQuery();
  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    start_datetime: '',
    end_datetime: '',
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  
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
      eventData.append('start_datetime', formData.start_datetime);
      eventData.append('end_datetime', formData.end_datetime);
      if (bannerFile) {
        eventData.append('banner_image', bannerFile);
      }
      
      await createEvent(eventData as any).unwrap();
      setFormData({ title: '', description: '', venue: '', start_datetime: '', end_datetime: '' });
      setBannerFile(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };
  
  if (isLoading) return <div className="text-center py-4">Loading events...</div>;
  if (error) return <div className="text-red-600 text-center py-4">Error loading events</div>;
  
  const events = eventsData?.results || [];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total: {eventsData?.count || 0} events
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Button>
        </div>
      </div>
      
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
                {venues.map((venue: any) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} - {venue.city}, {venue.country}
                  </option>
                ))}
              </select>
            </div>
            <InputField
              type="datetime-local"
              name="start_datetime"
              placeholder="Start Date & Time"
              value={formData.start_datetime}
              onChange={handleInputChange}
              required
            />
            <InputField
              type="datetime-local"
              name="end_datetime"
              placeholder="End Date & Time"
              value={formData.end_datetime}
              onChange={handleInputChange}
              required
            />
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
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
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
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event: any) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {event.banner_image && (
                        <img 
                          src={event.banner_image} 
                          alt={event.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.venue?.name}</div>
                    <div className="text-sm text-gray-500">{event.venue?.city}, {event.venue?.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(event.start_datetime).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      event.status === 'published' ? 'bg-green-100 text-green-800' :
                      event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.organizer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.is_featured ? '⭐ Yes' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN DASHBOARD COMPONENT =============
const SuperAdminDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [logoutMutation] = useLogoutMutation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  // Fetch real data
  const { data: usersData } = useGetUsersListQuery();
  const { data: eventsData } = useGetEventsQuery();
  const { data: venuesData } = useGetVenuesQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: tagsData } = useGetTagsQuery();
  
  // Calculate real stats
  const totalUsers = usersData?.data?.length || usersData?.length || 0;
  const totalEvents = eventsData?.count || eventsData?.results?.length || 0;
  const totalVenues = venuesData?.data?.length || 0;
  const totalCategories = categoriesData?.count || 0;
  const totalTags = tagsData?.count || 0;

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('email');
      localStorage.removeItem('full_name');
      localStorage.removeItem('user_id');
      navigate('/signIn');
    }
  };

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Categories', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Tags', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Events', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Venues', icon: <Ticket className="w-5 h-5" /> },
    { name: 'Tickets', icon: <Ticket className="w-5 h-5" /> },
    { name: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Users', icon: <Users className="w-5 h-5" /> },
    { name: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleMenuClick = (name: string) => {
    if (name === 'Logout') {
      handleLogout();
    } else {
      setActiveMenu(name);
    }
  };

  const stats: StatCardProps[] = [
    { title: 'Total Users', value: totalUsers.toString(), change: '+12.5%', isPositive: true },
    { title: 'Total Events', value: totalEvents.toString(), change: '+8.2%', isPositive: true },
    { title: 'Total Venues', value: totalVenues.toString(), change: '+15.3%', isPositive: true },
    { title: 'Total Categories', value: totalCategories.toString(), change: '+3.2%', isPositive: true },
    { title: 'Total Tags', value: totalTags.toString(), change: '+5.1%', isPositive: true },
    { title: 'Active Events', value: (eventsData?.results?.filter((e: any) => e.status === 'published')?.length || 0).toString(), change: '+2.5%', isPositive: true },
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
        onMenuClick={handleMenuClick}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={user?.fullName || localStorage.getItem('full_name') || 'Admin User'} userRole={user?.role || 'Super Admin'} />

        <main className="flex-1 overflow-y-auto p-8">
          {activeMenu === 'Dashboard' && (
            <>
              <StatsGrid stats={stats} />
              <ChartsGrid barChartData={barChartData} lineChartData={lineChartData} />
              <TransactionsGrid recentPayments={recentPayments} transactions={transactions} />
            </>
          )}
          
          {activeMenu === 'Users' && (
            <UsersManagement />
          )}
          
          {activeMenu === 'Categories' && (
            <CategoriesManagement />
          )}
          
          {activeMenu === 'Tags' && (
            <TagsManagement />
          )}
          
          {activeMenu === 'Events' && (
            <EventsManagement key={activeMenu} />
          )}
          
          {activeMenu === 'Venues' && (
            <VenuesManagement />
          )}
          
          {activeMenu !== 'Dashboard' && activeMenu !== 'Users' && activeMenu !== 'Categories' && activeMenu !== 'Tags' && activeMenu !== 'Events' && activeMenu !== 'Venues' && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{activeMenu}</h2>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;