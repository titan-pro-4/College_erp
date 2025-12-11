import React from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Users, 
  DollarSign, 
  FileText,
  Home, 
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { currentUser } = useApp();

  // Comprehensive admin statistics
  const adminStats = {
    totalStudents: 1247,
    totalRevenue: 8450000,
    pendingApprovals: 27,
    activeStaff: 89,
    occupancyRate: 92,
    averageAttendance: 87,
    thisMonthAdmissions: 45,
    outstandingFees: 1250000
  };

  const monthlyRevenue = [
    { month: 'Apr', revenue: 7200000, expenses: 5100000 },
    { month: 'May', revenue: 7800000, expenses: 5300000 },
    { month: 'Jun', revenue: 8100000, expenses: 5200000 },
    { month: 'Jul', revenue: 8450000, expenses: 5400000 },
    { month: 'Aug', revenue: 8200000, expenses: 5500000 },
    { month: 'Sep', revenue: 8450000, expenses: 5600000 },
  ];

  const admissionTrend = [
    { month: 'Apr', admissions: 38 },
    { month: 'May', admissions: 42 },
    { month: 'Jun', admissions: 51 },
    { month: 'Jul', admissions: 45 },
    { month: 'Aug', admissions: 39 },
    { month: 'Sep', admissions: 45 },
  ];

  const courseDistribution = [
    { name: 'B.Tech', value: 520, color: '#3b82f6' },
    { name: 'M.Tech', value: 180, color: '#8b5cf6' },
    { name: 'MBA', value: 245, color: '#10b981' },
    { name: 'B.Sc', value: 302, color: '#f59e0b' },
  ];

  const departmentPerformance = [
    { dept: 'CSE', avgCGPA: 8.7, students: 320, placement: 92 },
    { dept: 'ECE', avgCGPA: 8.4, students: 280, placement: 88 },
    { dept: 'Mech', avgCGPA: 8.2, students: 250, placement: 85 },
    { dept: 'Civil', avgCGPA: 8.5, students: 220, placement: 82 },
    { dept: 'MBA', avgCGPA: 8.6, students: 245, placement: 95 },
  ];

  const recentAlerts = [
    { type: 'warning', message: '27 applications pending approval', time: '5 mins ago' },
    { type: 'info', message: 'Hostel occupancy at 92% - nearing capacity', time: '1 hour ago' },
    { type: 'success', message: 'Monthly revenue target achieved', time: '2 hours ago' },
    { type: 'warning', message: '₹12.5L outstanding fees require follow-up', time: '3 hours ago' },
  ];

  const quickActions = [
    { label: 'Approve Admissions', count: 12, icon: FileText, color: 'orange' },
    { label: 'Review Fees', count: 8, icon: DollarSign, color: 'green' },
    { label: 'Hostel Allocation', count: 5, icon: Home, color: 'blue' },
    { label: 'Staff Management', count: 2, icon: Users, color: 'purple' },
  ];

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Administrator Dashboard - {currentUser?.name || 'Admin'}
        </h1>
        <p className="text-gray-600">Complete institutional overview and management</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <span className="text-2xl font-bold">{adminStats.totalStudents}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Total Students</h3>
          <p className="text-xs opacity-75 mt-1">+{adminStats.thisMonthAdmissions} this month</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <span className="text-2xl font-bold">₹{(adminStats.totalRevenue / 1000000).toFixed(1)}M</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
          <p className="text-xs opacity-75 mt-1">This month</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8" />
            <span className="text-2xl font-bold">{adminStats.pendingApprovals}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Pending Approvals</h3>
          <p className="text-xs opacity-75 mt-1">Requires action</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <Home className="w-8 h-8" />
            <span className="text-2xl font-bold">{adminStats.occupancyRate}%</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Hostel Occupancy</h3>
          <p className="text-xs opacity-75 mt-1">Near capacity</p>
        </div>
      </div>

      {/* Charts Section - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue & Expenses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Revenue vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue (₹)" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Admission Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Admission Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={admissionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="admissions" stroke="#3b82f6" strokeWidth={3} name="New Admissions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Section - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Course Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-purple-600" />
            Course Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {courseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-orange-600" />
            Department Performance
          </h3>
          <div className="space-y-4">
            {departmentPerformance.map((dept, index) => (
              <div key={index} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">{dept.dept}</h4>
                  <span className="text-sm text-gray-600">{dept.students} students</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Avg CGPA:</span>
                    <span className="ml-2 font-semibold text-blue-600">{dept.avgCGPA}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Placement:</span>
                    <span className="ml-2 font-semibold text-green-600">{dept.placement}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`p-4 rounded-lg bg-${action.color}-50 hover:bg-${action.color}-100 transition-colors border border-${action.color}-200 text-left`}
            >
              <div className="flex items-center justify-between mb-2">
                <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                <span className={`text-lg font-bold text-${action.color}-600`}>{action.count}</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
          Recent Alerts & Notifications
        </h3>
        <div className="space-y-3">
          {recentAlerts.map((alert, index) => (
            <div key={index} className={`flex items-start p-4 rounded-lg ${
              alert.type === 'warning' ? 'bg-orange-50 border-l-4 border-orange-500' :
              alert.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
              'bg-blue-50 border-l-4 border-blue-500'
            }`}>
              <div className="flex-shrink-0 mr-3">
                {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-600" />}
                {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                {alert.type === 'info' && <Activity className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-semibold text-gray-800">{alert.message}</p>
                <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
