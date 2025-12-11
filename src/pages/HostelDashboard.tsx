import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Building, 
  Users, 
  Clock, 
  Wrench,
  FileText,
  Download,
  AlertCircle,
  UserCheck,
  UserX,
  TrendingUp,
  Bed,
  DoorOpen
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DetailModal from '../components/DetailModal';

const HostelDashboard: React.FC = () => {
  const { currentUser, addNotification } = useApp();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  // Mock hostel data
  const hostelStats = {
    totalCapacity: 500,
    occupiedRooms: 385,
    availableRooms: 115,
    pendingApplications: 18,
    maintenanceRequests: 7,
    urgentRequests: 2,
    occupancyRate: 77,
  };

  const hostelBlocks = [
    { name: 'Block A', capacity: 150, occupied: 120, available: 30, gender: 'Boys' },
    { name: 'Block B', capacity: 150, occupied: 135, available: 15, gender: 'Boys' },
    { name: 'Block C', capacity: 100, occupied: 80, available: 20, gender: 'Girls' },
    { name: 'Block D', capacity: 100, occupied: 50, available: 50, gender: 'Girls' },
  ];

  const pendingApplications = [
    {
      id: 'APP-001',
      studentName: 'Amit Kumar',
      studentId: 'STU-2023-001',
      course: 'B.Tech CSE',
      semester: '3rd',
      gender: 'Male',
      appliedDate: '2025-09-25',
      status: 'Pending',
      cgpa: 8.5,
      distance: '450 km'
    },
    {
      id: 'APP-002',
      studentName: 'Priya Sharma',
      studentId: 'STU-2023-002',
      course: 'B.Tech ECE',
      semester: '5th',
      gender: 'Female',
      appliedDate: '2025-09-26',
      status: 'Pending',
      cgpa: 9.2,
      distance: '350 km'
    },
    {
      id: 'APP-003',
      studentName: 'Rahul Verma',
      studentId: 'STU-2023-003',
      course: 'B.Tech ME',
      semester: '1st',
      gender: 'Male',
      appliedDate: '2025-09-27',
      status: 'Pending',
      cgpa: 7.8,
      distance: '500 km'
    },
    {
      id: 'APP-004',
      studentName: 'Sneha Patel',
      studentId: 'STU-2023-004',
      course: 'B.Tech IT',
      semester: '3rd',
      gender: 'Female',
      appliedDate: '2025-09-28',
      status: 'Pending',
      cgpa: 8.9,
      distance: '280 km'
    },
    {
      id: 'APP-005',
      studentName: 'Vikram Singh',
      studentId: 'STU-2023-005',
      course: 'B.Tech CSE',
      semester: '5th',
      gender: 'Male',
      appliedDate: '2025-09-29',
      status: 'Pending',
      cgpa: 8.2,
      distance: '420 km'
    },
  ];

  const allocatedStudents = [
    { name: 'Rajesh Kumar', id: 'STU-2023-101', room: 'A-101', block: 'A', floor: '1', checkinDate: '2025-08-01' },
    { name: 'Ankit Sharma', id: 'STU-2023-102', room: 'A-102', block: 'A', floor: '1', checkinDate: '2025-08-01' },
    { name: 'Pooja Singh', id: 'STU-2023-201', room: 'C-201', block: 'C', floor: '2', checkinDate: '2025-08-02' },
    { name: 'Neha Gupta', id: 'STU-2023-202', room: 'C-202', block: 'C', floor: '2', checkinDate: '2025-08-02' },
    { name: 'Sanjay Patel', id: 'STU-2023-103', room: 'B-103', block: 'B', floor: '1', checkinDate: '2025-08-03' },
  ];

  const maintenanceRequests = [
    {
      id: 'MNT-001',
      room: 'A-205',
      block: 'A',
      issueType: 'Plumbing',
      description: 'Water leakage in bathroom',
      reportedDate: '2025-09-30',
      status: 'Pending',
      priority: 'High',
      reportedBy: 'Amit Kumar'
    },
    {
      id: 'MNT-002',
      room: 'B-310',
      block: 'B',
      issueType: 'Electrical',
      description: 'Fan not working',
      reportedDate: '2025-10-01',
      status: 'In Progress',
      priority: 'Medium',
      reportedBy: 'Rahul Verma'
    },
    {
      id: 'MNT-003',
      room: 'C-105',
      block: 'C',
      issueType: 'Furniture',
      description: 'Broken chair',
      reportedDate: '2025-10-02',
      status: 'Pending',
      priority: 'Low',
      reportedBy: 'Priya Sharma'
    },
    {
      id: 'MNT-004',
      room: 'A-101',
      block: 'A',
      issueType: 'Electrical',
      description: 'Power socket not working',
      reportedDate: '2025-09-28',
      status: 'Resolved',
      priority: 'High',
      reportedBy: 'Rajesh Kumar'
    },
    {
      id: 'MNT-005',
      room: 'D-202',
      block: 'D',
      issueType: 'Plumbing',
      description: 'Tap dripping continuously',
      reportedDate: '2025-10-01',
      status: 'In Progress',
      priority: 'Medium',
      reportedBy: 'Sneha Patel'
    },
  ];

  const occupancyData = hostelBlocks.map(block => ({
    name: block.name,
    occupied: block.occupied,
    available: block.available,
    occupancyRate: Math.round((block.occupied / block.capacity) * 100)
  }));

  const maintenanceByType = [
    { type: 'Electrical', count: 3, color: '#f59e0b' },
    { type: 'Plumbing', count: 2, color: '#3b82f6' },
    { type: 'Furniture', count: 1, color: '#10b981' },
    { type: 'Other', count: 1, color: '#6b7280' },
  ];

  const recentActivity = [
    { action: 'Room allocated', student: 'Amit Kumar', room: 'B-304', time: '2 hours ago', type: 'allocation' },
    { action: 'Maintenance resolved', room: 'A-101', issue: 'Power socket', time: '4 hours ago', type: 'maintenance' },
    { action: 'New application', student: 'Vikram Singh', time: '6 hours ago', type: 'application' },
    { action: 'Application rejected', student: 'Ravi Kumar', reason: 'No vacancy', time: '1 day ago', type: 'rejection' },
  ];

  const handleApproveApplication = (application: any) => {
    setSelectedApplication(application);
    setShowAllocationModal(true);
  };

  const handleRejectApplication = (application: any) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      addNotification({
        id: `notif-${Date.now()}`,
        type: 'info',
        message: `Application ${application.id} rejected`,
        timestamp: new Date().toISOString(),
        read: false
      });
      alert(`❌ Application Rejected\n\nStudent: ${application.studentName}\nID: ${application.studentId}\nReason: ${reason}\n\nRejection notification sent to student.`);
    }
  };

  const handleAllocateRoom = () => {
    if (!selectedBlock || !selectedFloor || !selectedRoom) {
      alert('Please select block, floor, and room');
      return;
    }

    if (selectedApplication) {
      addNotification({
        id: `notif-${Date.now()}`,
        type: 'success',
        message: `Room allocated to ${selectedApplication.studentName}`,
        timestamp: new Date().toISOString(),
        read: false
      });

      alert(`✅ Room Allocated Successfully!\n\nStudent: ${selectedApplication.studentName}\nID: ${selectedApplication.studentId}\nRoom: ${selectedBlock}-${selectedRoom}\nFloor: ${selectedFloor}\n\nAllocation confirmation sent to student.`);

      setShowAllocationModal(false);
      setSelectedApplication(null);
      setSelectedBlock('');
      setSelectedFloor('');
      setSelectedRoom('');
    }
  };

  const handleUpdateMaintenanceStatus = (requestId: string, newStatus: string) => {
    addNotification({
      id: `notif-${Date.now()}`,
      type: 'success',
      message: `Maintenance request ${requestId} updated to ${newStatus}`,
      timestamp: new Date().toISOString(),
      read: false
    });
    alert(`✅ Status Updated!\n\nRequest ID: ${requestId}\nNew Status: ${newStatus}\n\nNotification sent to concerned parties.`);
  };

  const handleExportReport = () => {
    alert('Exporting occupancy report...\n\nFormat: CSV\nIncludes: All blocks, rooms, students, occupancy rates');
  };

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Hostel Management Dashboard - {currentUser?.name || 'Warden'}
        </h1>
        <p className="text-gray-600">Manage hostel allocations, maintenance, and occupancy</p>
        
        {/* Quick Action Buttons */}
        <div className="flex gap-3 mt-4 flex-wrap">
          <button 
            onClick={() => setActiveModal('applications')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Pending Applications ({pendingApplications.length})
          </button>
          <button 
            onClick={() => setActiveModal('occupancy')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Building className="w-4 h-4" />
            Occupancy Reports
          </button>
          <button 
            onClick={() => setActiveModal('maintenance')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Wrench className="w-4 h-4" />
            Maintenance ({maintenanceRequests.filter(r => r.status !== 'Resolved').length})
          </button>
          <button 
            onClick={() => setActiveModal('students')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Allocated Students
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div 
          onClick={() => setActiveModal('occupancy')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <Building className="w-8 h-8" />
            <span className="text-2xl font-bold">{hostelStats.totalCapacity}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Total Capacity</h3>
          <p className="text-xs opacity-75 mt-1">{hostelStats.occupancyRate}% occupied</p>
        </div>

        <div 
          onClick={() => setActiveModal('occupancy')}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <Bed className="w-8 h-8" />
            <span className="text-2xl font-bold">{hostelStats.occupiedRooms}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Occupied Rooms</h3>
          <p className="text-xs opacity-75 mt-1">{hostelStats.availableRooms} available</p>
        </div>

        <div 
          onClick={() => setActiveModal('applications')}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8" />
            <span className="text-2xl font-bold">{hostelStats.pendingApplications}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Pending Applications</h3>
          <p className="text-xs opacity-75 mt-1">Requires review</p>
        </div>

        <div 
          onClick={() => setActiveModal('maintenance')}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <Wrench className="w-8 h-8" />
            <span className="text-2xl font-bold">{hostelStats.maintenanceRequests}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Maintenance Requests</h3>
          <p className="text-xs opacity-75 mt-1">{hostelStats.urgentRequests} urgent</p>
        </div>
      </div>

      {/* Block-wise Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {hostelBlocks.map((block) => (
          <div key={block.name} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{block.name}</h3>
                <p className="text-xs text-gray-500">{block.gender} Hostel</p>
              </div>
              <DoorOpen className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-semibold text-gray-800">{block.capacity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Occupied:</span>
                <span className="font-semibold text-green-600">{block.occupied}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available:</span>
                <span className="font-semibold text-orange-600">{block.available}</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Occupancy</span>
                  <span className="font-semibold">{Math.round((block.occupied / block.capacity) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (block.occupied / block.capacity) > 0.9 ? 'bg-red-500' : 
                      (block.occupied / block.capacity) > 0.7 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${(block.occupied / block.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Occupancy by Block */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Occupancy by Block
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="occupied" fill="#10b981" name="Occupied" />
              <Bar dataKey="available" fill="#f59e0b" name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Wrench className="w-5 h-5 mr-2 text-orange-600" />
            Maintenance by Type
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={maintenanceByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, count }) => `${type}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {maintenanceByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Applications & Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              Recent Applications
            </h3>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-semibold">
              {pendingApplications.length} pending
            </span>
          </div>
          <div className="space-y-3">
            {pendingApplications.slice(0, 4).map((app) => (
              <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{app.studentName}</h4>
                    <p className="text-sm text-gray-600">{app.studentId} - {app.course}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    {app.status}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    CGPA: {app.cgpa} | {app.distance}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRejectApplication(app)}
                      className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs font-medium"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveApplication(app)}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setActiveModal('applications')}
            className="w-full mt-4 text-center text-blue-600 hover:underline text-sm font-medium"
          >
            View All Applications →
          </button>
        </div>

        {/* Urgent Maintenance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
              Maintenance Requests
            </h3>
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-semibold">
              {maintenanceRequests.filter(r => r.status !== 'Resolved').length} active
            </span>
          </div>
          <div className="space-y-3">
            {maintenanceRequests.slice(0, 4).map((req) => (
              <div key={req.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{req.issueType}</h4>
                    <p className="text-sm text-gray-600">{req.room} - {req.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    req.priority === 'High' ? 'bg-red-100 text-red-800' :
                    req.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {req.priority}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    {req.status} | {new Date(req.reportedDate).toLocaleDateString()}
                  </span>
                  {req.status !== 'Resolved' && (
                    <select 
                      onChange={(e) => handleUpdateMaintenanceStatus(req.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                      defaultValue=""
                    >
                      <option value="" disabled>Update Status</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setActiveModal('maintenance')}
            className="w-full mt-4 text-center text-blue-600 hover:underline text-sm font-medium"
          >
            View All Requests →
          </button>
        </div>
      </div>

      {/* Recent Activity & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {activity.type === 'allocation' && <UserCheck className="w-5 h-5 text-green-600" />}
                  {activity.type === 'maintenance' && <Wrench className="w-5 h-5 text-orange-600" />}
                  {activity.type === 'application' && <FileText className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'rejection' && <UserX className="w-5 h-5 text-red-600" />}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-600">
                      {activity.student && `${activity.student} - `}
                      {activity.room && `${activity.room} `}
                      {activity.issue && `- ${activity.issue}`}
                      {activity.reason && `- ${activity.reason}`}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
            Alerts
          </h3>
          <div className="space-y-3">
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Urgent Maintenance</p>
                  <p className="text-xs text-gray-600">{hostelStats.urgentRequests} requests need immediate attention</p>
                  <button 
                    onClick={() => setActiveModal('maintenance')}
                    className="text-xs text-red-600 hover:underline mt-1 font-medium"
                  >
                    View Now →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Pending Applications</p>
                  <p className="text-xs text-gray-600">{pendingApplications.length} applications waiting for review</p>
                  <button 
                    onClick={() => setActiveModal('applications')}
                    className="text-xs text-orange-600 hover:underline mt-1 font-medium"
                  >
                    Review Now →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">High Occupancy</p>
                  <p className="text-xs text-gray-600">Block B at 90% capacity - consider alternatives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modals */}
      {/* Applications Modal */}
      <DetailModal
        isOpen={activeModal === 'applications'}
        onClose={() => setActiveModal(null)}
        title="Hostel Applications"
        subtitle={`${pendingApplications.length} pending applications`}
        showFilter
        showSearch
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm text-gray-600">Total Applications</p>
              <h3 className="text-xl font-bold text-purple-600">{pendingApplications.length}</h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Approved Today</p>
              <h3 className="text-xl font-bold text-green-600">3</h3>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-gray-600">Rejected</p>
              <h3 className="text-xl font-bold text-red-600">1</h3>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Course</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CGPA</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Distance</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    <div>{app.studentName}</div>
                    <div className="text-xs text-gray-500">{app.gender}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{app.studentId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div>{app.course}</div>
                    <div className="text-xs text-gray-500">Sem {app.semester}</div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600">{app.cgpa}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{app.distance}</td>
                  <td className="px-4 py-3 text-sm">
                    <button 
                      onClick={() => handleRejectApplication(app)}
                      className="text-red-600 hover:underline font-medium mr-2"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleApproveApplication(app)}
                      className="text-green-600 hover:underline font-medium"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailModal>

      {/* Occupancy Modal */}
      <DetailModal
        isOpen={activeModal === 'occupancy'}
        onClose={() => setActiveModal(null)}
        title="Occupancy Reports"
        subtitle="Block-wise occupancy and availability"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Hostel Blocks Overview</h3>
            <button 
              onClick={handleExportReport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Total Capacity</p>
              <h3 className="text-2xl font-bold text-blue-600">{hostelStats.totalCapacity}</h3>
              <p className="text-xs text-gray-500 mt-1">All blocks</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Occupancy Rate</p>
              <h3 className="text-2xl font-bold text-green-600">{hostelStats.occupancyRate}%</h3>
              <p className="text-xs text-gray-500 mt-1">{hostelStats.occupiedRooms}/{hostelStats.totalCapacity}</p>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Block</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Gender</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Capacity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Occupied</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Available</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Occupancy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {hostelBlocks.map((block) => (
                <tr key={block.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{block.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{block.gender}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600">{block.capacity}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">{block.occupied}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-orange-600">{block.available}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{Math.round((block.occupied / block.capacity) * 100)}%</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (block.occupied / block.capacity) > 0.9 ? 'bg-red-500' : 
                            (block.occupied / block.capacity) > 0.7 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${(block.occupied / block.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="occupied" fill="#10b981" name="Occupied" />
              <Bar dataKey="available" fill="#f59e0b" name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DetailModal>

      {/* Maintenance Modal */}
      <DetailModal
        isOpen={activeModal === 'maintenance'}
        onClose={() => setActiveModal(null)}
        title="Maintenance Requests"
        subtitle={`${maintenanceRequests.filter(r => r.status !== 'Resolved').length} active requests`}
        showFilter
      >
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <p className="text-sm text-gray-600">Total Requests</p>
              <h3 className="text-xl font-bold text-orange-600">{maintenanceRequests.length}</h3>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600">Pending</p>
              <h3 className="text-xl font-bold text-yellow-600">
                {maintenanceRequests.filter(r => r.status === 'Pending').length}
              </h3>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">In Progress</p>
              <h3 className="text-xl font-bold text-blue-600">
                {maintenanceRequests.filter(r => r.status === 'In Progress').length}
              </h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Resolved</p>
              <h3 className="text-xl font-bold text-green-600">
                {maintenanceRequests.filter(r => r.status === 'Resolved').length}
              </h3>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Request ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Room</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Issue Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {maintenanceRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{req.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div>{req.room}</div>
                    <div className="text-xs text-gray-500">Block {req.block}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div>{req.issueType}</div>
                    <div className="text-xs text-gray-500">{req.description}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      req.priority === 'High' ? 'bg-red-100 text-red-700' :
                      req.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      req.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      req.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {req.status !== 'Resolved' && (
                      <select 
                        onChange={(e) => handleUpdateMaintenanceStatus(req.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        defaultValue=""
                      >
                        <option value="" disabled>Update Status</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailModal>

      {/* Allocated Students Modal */}
      <DetailModal
        isOpen={activeModal === 'students'}
        onClose={() => setActiveModal(null)}
        title="Allocated Students"
        subtitle={`${allocatedStudents.length} students in hostels`}
        showSearch
      >
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Room</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Block</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Check-in Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allocatedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{student.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{student.id}</td>
                <td className="px-4 py-3 text-sm font-semibold text-blue-600">{student.room}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{student.block}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{new Date(student.checkinDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DetailModal>

      {/* Room Allocation Modal */}
      {showAllocationModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Allocate Room</h3>
                    <p className="text-sm text-gray-600">{selectedApplication.studentName} - {selectedApplication.studentId}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAllocationModal(false);
                    setSelectedApplication(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Student Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Course:</span>
                    <span className="ml-2 font-semibold text-gray-800">{selectedApplication.course}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Semester:</span>
                    <span className="ml-2 font-semibold text-gray-800">{selectedApplication.semester}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Gender:</span>
                    <span className="ml-2 font-semibold text-gray-800">{selectedApplication.gender}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">CGPA:</span>
                    <span className="ml-2 font-semibold text-gray-800">{selectedApplication.cgpa}</span>
                  </div>
                </div>
              </div>

              {/* Room Selection */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">Select Room</h4>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Block</label>
                    <select 
                      value={selectedBlock}
                      onChange={(e) => setSelectedBlock(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">Select Block</option>
                      {hostelBlocks
                        .filter(b => b.gender === (selectedApplication.gender === 'Male' ? 'Boys' : 'Girls') && b.available > 0)
                        .map(block => (
                          <option key={block.name} value={block.name}>
                            {block.name} ({block.available} available)
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Floor</label>
                    <select 
                      value={selectedFloor}
                      onChange={(e) => setSelectedFloor(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      disabled={!selectedBlock}
                    >
                      <option value="">Select Floor</option>
                      <option value="1">Floor 1</option>
                      <option value="2">Floor 2</option>
                      <option value="3">Floor 3</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Room Number</label>
                    <select 
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      disabled={!selectedFloor}
                    >
                      <option value="">Select Room</option>
                      <option value="01">Room 01</option>
                      <option value="02">Room 02</option>
                      <option value="03">Room 03</option>
                      <option value="04">Room 04</option>
                      <option value="05">Room 05</option>
                    </select>
                  </div>
                </div>

                {selectedBlock && selectedFloor && selectedRoom && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      ✓ Room <strong>{selectedBlock}-{selectedRoom}</strong> on Floor {selectedFloor} will be allocated
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAllocationModal(false);
                    setSelectedApplication(null);
                    setSelectedBlock('');
                    setSelectedFloor('');
                    setSelectedRoom('');
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAllocateRoom}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={!selectedBlock || !selectedFloor || !selectedRoom}
                >
                  Allocate Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelDashboard;
