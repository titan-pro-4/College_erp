import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Home,
  FileText,
  UserCircle,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, notifications, setCurrentUser, markNotificationRead } = useApp();
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Role-based navigation
  const getNavigationItems = () => {
    const { role } = currentUser;

    if (role === 'student') {
      return [
        { name: 'Dashboard', href: '/student-dashboard', icon: LayoutDashboard },
        { name: 'My Profile', href: '/student/profile', icon: UserCircle },
        { name: 'Attendance', href: '/student/attendance', icon: FileText },
        { name: 'Results', href: '/student/results', icon: FileText },
        { name: 'Library', href: '/student/library', icon: FileText },
        { name: 'Fees', href: '/student/fees', icon: DollarSign },
        { name: 'Admit Card', href: '/student/admit-card', icon: FileText },
        { name: 'Feedback', href: '/student/feedback', icon: FileText },
      ];
    } else if (role === 'faculty') {
      return [
        { name: 'Dashboard', href: '/faculty-dashboard', icon: LayoutDashboard },
        { name: 'My Classes', href: '/faculty-dashboard?section=classes', icon: Users },
        { name: 'Exams', href: '/faculty-dashboard?section=exams', icon: FileText },
        { name: 'Student Performance', href: '/faculty-dashboard?section=performance', icon: FileText },
        { name: 'Attendance', href: '/faculty-dashboard?section=attendance', icon: FileText },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    } else if (role === 'hostel-warden') {
      return [
        { name: 'Dashboard', href: '/hostel-dashboard', icon: LayoutDashboard },
        { name: 'Applications', href: '/hostel-dashboard', icon: FileText },
        { name: 'Occupancy', href: '/hostel-dashboard', icon: Home },
        { name: 'Maintenance', href: '/hostel-dashboard', icon: FileText },
        { name: 'Reports', href: '/hostel-dashboard', icon: FileText },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    } else if (role === 'clerk') {
      return [
        { name: 'Dashboard', href: '/clerk-dashboard', icon: LayoutDashboard },
        { name: 'Admissions', href: '/admissions', icon: UserCircle },
        { name: 'Students', href: '/students', icon: Users },
        { name: 'Fees', href: '/fees', icon: DollarSign },
        { name: 'Hostel', href: '/hostel', icon: Home },
        { name: 'Exams', href: '/exams', icon: FileText },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    } else if (role === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin-dashboard', icon: LayoutDashboard },
        { name: 'Admissions', href: '/admissions', icon: UserCircle },
        { name: 'Students', href: '/students', icon: Users },
        { name: 'Fees', href: '/fees', icon: DollarSign },
        { name: 'Hostel', href: '/hostel', icon: Home },
        { name: 'Exams', href: '/exams', icon: FileText },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    }

    return [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Settings', href: '/settings', icon: Settings },
    ];
  };

  const navigation = getNavigationItems();

  const handleLogout = () => {
    // Clear user and redirect to homepage
    setCurrentUser({
      name: 'Guest',
      role: 'student',
      id: 'guest',
    });
    navigate('/');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-30">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CE</span>
              </div>
              <span className="font-semibold text-lg hidden sm:block">
                College ERP
              </span>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search students by name, ID, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Global search"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markNotificationRead(notification.id)}
                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notification.type === 'success' ? 'bg-green-500' :
                                notification.type === 'error' ? 'bg-red-500' :
                                notification.type === 'warning' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <button
                        onClick={() => {
                          notifications.forEach(n => markNotificationRead(n.id));
                        }}
                        className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {currentUser.name.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{currentUser.name}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {currentUser.role.replace('-', ' ')}
                  </div>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-gray-200 transition-transform duration-200 z-20 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-1" role="navigation">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Help button at bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <button className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Need Help?
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`pt-16 transition-all duration-200 ${
          sidebarOpen ? 'ml-60' : 'ml-0'
        }`}
      >
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
