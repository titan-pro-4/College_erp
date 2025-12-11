import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  UserPlus,
  DollarSign,
  Home,
  AlertCircle,
  TrendingUp,
  Download,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { admissionService } from '../services/admissionService';
import { studentService } from '../services/studentService';

export default function Dashboard() {
  const { students, payments, hostelRooms } = useApp();
  const navigate = useNavigate();
  
  // Real-time stats from database
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingAdmissions: 0,
    totalCollections: 0,
    hostelOccupancy: 0,
    overduesFees: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch key stats
      const [studentsList, pendingAdmissions] = await Promise.all([
        studentService.getAll(),
        admissionService.getPending(),
      ]);

      setStats({
        totalStudents: studentsList.length,
        pendingAdmissions: pendingAdmissions.length,
        totalCollections: 0, // Will be calculated from actual fee payments later
        hostelOccupancy: hostelRooms.length > 0 ? Math.round((totalOccupied / hostelRooms.length) * 100) : 0,
        overduesFees: 0, // Will be calculated from actual fee data later
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPIs (keeping old logic as fallback)
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAdmissions = students.filter(
    (s) => s.admissionDate === today
  ).length;
  const todayCollections = payments
    .filter((p) => p.date === today)
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOccupied = hostelRooms.filter(
    (r) => r.status === 'Occupied' || r.status === 'Full'
  ).length;
  const hostelOccupancy = Math.round((totalOccupied / hostelRooms.length) * 100);
  const pendingDues = students.reduce((sum, s) => sum + s.feeBalance, 0);

  // Mock collections data for chart
  const collectionsData = Array.from({ length: 30 }, (_, i) => ({
    date: format(new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), 'MM/dd'),
    amount: Math.floor(Math.random() * 50000) + 20000,
  }));

  const kpiCards = [
    {
      title: 'Total Students',
      value: loading ? '...' : stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Pending Admissions',
      value: loading ? '...' : stats.pendingAdmissions,
      icon: UserPlus,
      color: 'bg-orange-500',
      change: stats.pendingAdmissions > 0 ? 'Need Action' : 'All Clear',
    },
    {
      title: 'Today Collections',
      value: `₹${todayCollections.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-accent-success',
      change: '+8%',
    },
    {
      title: 'Hostel Occupancy',
      value: `${hostelOccupancy}%`,
      icon: Home,
      color: 'bg-purple-500',
      change: `${totalOccupied}/${hostelRooms.length}`,
    },
  ];

  // Export Report Function
  const exportReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('College ERP', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Dashboard Report', 105, 30, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy, HH:mm')}`, 105, 38, { align: 'center' });
    
    // KPIs Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Performance Indicators', 20, 55);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    let yPos = 65;
    doc.text(`Total Students: ${students.length}`, 25, yPos);
    yPos += 8;
    doc.text(`Today's Admissions: ${todayAdmissions}`, 25, yPos);
    yPos += 8;
    doc.text(`Today's Collections: ₹${todayCollections.toLocaleString()}`, 25, yPos);
    yPos += 8;
    doc.text(`Hostel Occupancy: ${hostelOccupancy}% (${totalOccupied}/${hostelRooms.length} rooms)`, 25, yPos);
    yPos += 8;
    doc.text(`Pending Dues: ₹${pendingDues.toLocaleString()}`, 25, yPos);
    
    // Students Summary
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Students Summary', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    yPos += 10;
    const activeCourses = new Set(students.map(s => s.course));
    doc.text(`Active Courses: ${activeCourses.size}`, 25, yPos);
    yPos += 8;
    doc.text(`Active Students: ${students.filter(s => s.status === 'Active').length}`, 25, yPos);
    
    // Payments Summary
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Payments Summary', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    yPos += 10;
    const totalPayments = payments.length;
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
    doc.text(`Total Payments: ${totalPayments}`, 25, yPos);
    yPos += 8;
    doc.text(`Total Collected: ₹${totalCollected.toLocaleString()}`, 25, yPos);
    yPos += 8;
    
    const paymentMethods = payments.reduce((acc: any, p) => {
      acc[p.method] = (acc[p.method] || 0) + 1;
      return acc;
    }, {});
    doc.text('Payment Methods:', 25, yPos);
    yPos += 6;
    Object.entries(paymentMethods).forEach(([method, count]) => {
      doc.text(`  - ${method}: ${count}`, 30, yPos);
      yPos += 6;
    });
    
    // Hostel Summary
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Hostel Summary', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    yPos += 10;
    const availableRooms = hostelRooms.filter(r => r.status === 'Available').length;
    const occupiedRooms = hostelRooms.filter(r => r.status === 'Occupied').length;
    const fullRooms = hostelRooms.filter(r => r.status === 'Full').length;
    const maintenanceRooms = hostelRooms.filter(r => r.status === 'Maintenance').length;
    
    doc.text(`Available: ${availableRooms}`, 25, yPos);
    yPos += 6;
    doc.text(`Occupied: ${occupiedRooms}`, 25, yPos);
    yPos += 6;
    doc.text(`Full: ${fullRooms}`, 25, yPos);
    yPos += 6;
    doc.text(`Maintenance: ${maintenanceRooms}`, 25, yPos);
    
    // Footer
    doc.setFontSize(8);
    doc.text('College ERP Dashboard Report', 105, 280, { align: 'center' });
    
    // Save PDF
    doc.save(`dashboard-report-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.pdf`);
  };

  // Quick Action Handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'admission':
        navigate('/admissions');
        break;
      case 'fee':
        navigate('/fees');
        break;
      case 'hostel':
        navigate('/hostel');
        break;
      case 'exam':
        navigate('/exams');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={exportReport}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {pendingDues > 100000 && (
        <div className="bg-accent-warning/10 border border-accent-warning/30 rounded-card p-4 flex items-start space-x-3">
          <AlertCircle className="text-accent-warning mt-0.5" size={20} />
          <div>
            <p className="font-medium text-neutral-900">
              High Pending Dues Alert
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Total pending dues: ₹{pendingDues.toLocaleString()}. Consider
              sending payment reminders.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="card hover:shadow-md transition-shadow animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {kpi.title}
                  </p>
                  <p className="text-3xl font-bold text-neutral-900 mt-2">
                    {kpi.value}
                  </p>
                  <div className="flex items-center space-x-1 mt-2 text-sm text-accent-success">
                    <TrendingUp size={14} />
                    <span>{kpi.change}</span>
                  </div>
                </div>
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collections Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            Collections - Last 30 Days
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={collectionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#0B5FFF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hostel Occupancy Map */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Hostel Occupancy Map</h3>
          <div className="grid grid-cols-4 gap-2">
            {hostelRooms.slice(0, 16).map((room) => (
              <div
                key={room.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                  room.status === 'Available'
                    ? 'bg-green-50 border-green-300'
                    : room.status === 'Occupied'
                    ? 'bg-yellow-50 border-yellow-300'
                    : room.status === 'Full'
                    ? 'bg-red-50 border-red-300'
                    : 'bg-gray-50 border-gray-300'
                }`}
                title={`${room.building}-${room.roomNumber} (${room.status})`}
              >
                <div className="text-xs font-semibold text-center">
                  {room.building}-{room.roomNumber}
                </div>
                <div className="text-xs text-center text-gray-600 mt-1">
                  {room.occupants.length}/{room.capacity}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-300 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-300 rounded"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-300 rounded"></div>
              <span>Full</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => handleQuickAction('admission')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors"
          >
            <UserPlus className="mx-auto mb-2 text-primary" size={24} />
            <span className="text-sm font-medium">New Admission</span>
          </button>
          <button 
            onClick={() => handleQuickAction('fee')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors"
          >
            <DollarSign className="mx-auto mb-2 text-primary" size={24} />
            <span className="text-sm font-medium">Collect Fee</span>
          </button>
          <button 
            onClick={() => handleQuickAction('hostel')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors"
          >
            <Home className="mx-auto mb-2 text-primary" size={24} />
            <span className="text-sm font-medium">Allocate Room</span>
          </button>
          <button 
            onClick={() => handleQuickAction('exam')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors"
          >
            <TrendingUp className="mx-auto mb-2 text-primary" size={24} />
            <span className="text-sm font-medium">Upload Marks</span>
          </button>
        </div>
      </div>
    </div>
  );
}
