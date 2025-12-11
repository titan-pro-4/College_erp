import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Users, 
  DollarSign, 
  FileText, 
  Home, 
  Clock,
  CheckCircle,
  TrendingUp,
  ClipboardCheck,
  Shield,
  Download,
  UserPlus,
  Receipt,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DetailModal from '../components/DetailModal';
import ApprovalModal from '../components/ApprovalModal';
import HostelAllocationModal from '../components/HostelAllocationModal';

const ClerkDashboard: React.FC = () => {
  const { currentUser, addNotification } = useApp();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedHostelRequest, setSelectedHostelRequest] = useState<any>(null);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [bulkImportFile, setBulkImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  
  const [admissionQueue, setAdmissionQueue] = useState([
    { id: 'APP-2025-1001', name: 'Rajesh Kumar', course: 'B.Tech CSE', date: '2025-10-01', status: 'Pending', email: 'rajesh.k@email.com', phone: '+91-9876543210', dob: '2005-03-15', address: '123 MG Road, Bangalore', previousSchool: 'Delhi Public School', percentage: 92.5, guardianName: 'Mr. Kumar', guardianPhone: '+91-9876543211' },
    { id: 'APP-2025-1002', name: 'Priya Sharma', course: 'B.Tech ECE', date: '2025-10-01', status: 'Pending', email: 'priya.s@email.com', phone: '+91-9876543220', dob: '2006-07-22', address: '456 Park Street, Mumbai', previousSchool: 'St. Mary\'s School', percentage: 89.3, guardianName: 'Mrs. Sharma', guardianPhone: '+91-9876543221' },
    { id: 'APP-2025-1003', name: 'Amit Patel', course: 'MBA', date: '2025-09-30', status: 'Under Review', email: 'amit.p@email.com', phone: '+91-9876543230', dob: '2000-11-10', address: '789 Lake View, Pune', previousSchool: 'National Institute', percentage: 85.7, guardianName: 'Mr. Patel', guardianPhone: '+91-9876543231' },
    { id: 'APP-2025-1004', name: 'Sneha Reddy', course: 'B.Sc CS', date: '2025-09-30', status: 'Pending', email: 'sneha.r@email.com', phone: '+91-9876543240', dob: '2006-01-18', address: '321 Beach Road, Chennai', previousSchool: 'Kendriya Vidyalaya', percentage: 91.2, guardianName: 'Mrs. Reddy', guardianPhone: '+91-9876543241' },
    { id: 'APP-2025-1005', name: 'Vikram Singh', course: 'M.Tech AI', date: '2025-09-29', status: 'Under Review', email: 'vikram.s@email.com', phone: '+91-9876543250', dob: '1999-05-25', address: '654 Hill Station, Shimla', previousSchool: 'IIT Delhi', percentage: 88.5, guardianName: 'Col. Singh', guardianPhone: '+91-9876543251' },
  ]);

  // Mock data for clerk operations - Traditional ERP Style
  const clerkStats = {
    pendingAdmissions: admissionQueue.filter(a => a.status === 'Pending' || a.status === 'Under Review').length,
    todayFeeCollection: 145000,
    todayCollectionCount: 28,
    hostelRequests: 8,
    pendingDocuments: 12,
    todayAttendanceMarked: 425,
    totalStudents: 1250,
    pendingVerification: 15,
    idCardsGenerated: 5,
    certificatesIssued: 8,
    pendingExamTasks: 6,
    pendingPaymentApprovals: 4
  };

  const feeCollectionData = [
    { day: 'Mon', amount: 125000 },
    { day: 'Tue', amount: 98000 },
    { day: 'Wed', amount: 145000 },
    { day: 'Thu', amount: 112000 },
    { day: 'Fri', amount: 145000 },
  ];

  const [hostelRequests, setHostelRequests] = useState([
    { id: 'HST-001', student: 'Arjun Mehta', studentId: 'STU-2025-001', email: 'arjun.m@college.edu', phone: '+91-9876543260', course: 'B.Tech CSE', semester: 'Semester 1', room: 'A-Block', date: '2025-10-01', status: 'Pending', gender: 'Male', reason: 'Prefer ground floor for easy access', medicalConditions: 'None' },
    { id: 'HST-002', student: 'Kavya Nair', studentId: 'STU-2025-002', email: 'kavya.n@college.edu', phone: '+91-9876543270', course: 'B.Tech ECE', semester: 'Semester 1', room: 'B-Block', date: '2025-10-01', status: 'Pending', gender: 'Female', reason: 'Need quiet environment for studies', medicalConditions: 'Mild asthma - need well-ventilated room' },
    { id: 'HST-003', student: 'Rohan Gupta', studentId: 'STU-2024-087', email: 'rohan.g@college.edu', phone: '+91-9876543280', course: 'B.Tech ME', semester: 'Semester 3', room: 'A-Block', date: '2025-09-30', status: 'Approved', gender: 'Male', reason: 'Roommate requested', medicalConditions: 'None' },
    { id: 'HST-004', student: 'Ananya Das', studentId: 'STU-2025-003', email: 'ananya.d@college.edu', phone: '+91-9876543290', course: 'B.Sc CS', semester: 'Semester 1', room: 'C-Block', date: '2025-09-30', status: 'Pending', gender: 'Female', reason: 'Close to library', medicalConditions: 'None' },
    { 
      id: 'HST-005', 
      student: 'Vikram Singh', 
      studentId: 'STU-2024-088',
      email: 'vikram.singh@college.edu',
      phone: '+91-9876543300',
      course: 'B.Tech ME',
      semester: 'Semester 3',
      room: 'B-Block', 
      date: '2025-09-28', 
      status: 'Approved',
      gender: 'Male',
      reason: 'Need hostel accommodation',
      medicalConditions: 'None'
    },
    { 
      id: 'HST-006', 
      student: 'Meera Iyer', 
      studentId: 'STU-2024-089',
      email: 'meera.iyer@college.edu',
      phone: '+91-9876543310',
      course: 'B.Sc CS',
      semester: 'Semester 1',
      room: 'C-Block', 
      date: '2025-09-27', 
      status: 'Rejected',
      gender: 'Female',
      reason: 'Required hostel facility',
      medicalConditions: 'None'
    },
  ]);

  const applicationStatusData = [
    { name: 'Approved', value: 45, color: '#10b981' },
    { name: 'Pending', value: 25, color: '#f59e0b' },
    { name: 'Rejected', value: 12, color: '#ef4444' },
    { name: 'Under Review', value: 18, color: '#3b82f6' },
  ];

  // Document Verification Queue - Traditional Clerk Function
  const [documentVerificationQueue, setDocumentVerificationQueue] = useState([
    { id: 'DOC-001', studentId: 'STU-2025-045', studentName: 'Neha Kapoor', documentType: '10th Marksheet', submittedOn: '2025-10-01', status: 'Pending', remarks: '' },
    { id: 'DOC-002', studentId: 'STU-2025-046', studentName: 'Rahul Joshi', documentType: 'Transfer Certificate', submittedOn: '2025-10-01', status: 'Pending', remarks: '' },
    { id: 'DOC-003', studentId: 'STU-2025-047', studentName: 'Pooja Menon', documentType: 'Aadhar Card', submittedOn: '2025-10-01', status: 'Verified', remarks: 'All details match' },
    { id: 'DOC-004', studentId: 'STU-2025-048', studentName: 'Karan Malhotra', documentType: '12th Marksheet', submittedOn: '2025-09-30', status: 'Pending', remarks: '' },
    { id: 'DOC-005', studentId: 'STU-2025-049', studentName: 'Divya Rao', documentType: 'Caste Certificate', submittedOn: '2025-09-30', status: 'Rejected', remarks: 'Invalid seal' },
  ]);

  const recentActivity = [
    { action: 'Approved admission', student: 'Rahul Verma', time: '10 mins ago', type: 'admission' },
    { action: 'Collected fee payment', student: 'Meera Iyer', time: '25 mins ago', type: 'fee' },
    { action: 'Verified documents', student: 'Pooja Menon', time: '45 mins ago', type: 'verification' },
    { action: 'Allocated hostel room', student: 'Karthik Reddy', time: '1 hour ago', type: 'hostel' },
    { action: 'Generated ID card', student: 'Sanjay Kumar', time: '2 hours ago', type: 'idcard' },
    { action: 'Marked attendance', class: 'B.Tech CSE - Sem 3', time: '3 hours ago', type: 'attendance' },
  ];

  const handleProcessAdmission = (application: any) => {
    setSelectedApplication(application);
    setActiveModal('approval');
  };

  const handleApprove = (id: string, remarks?: string) => {
    setAdmissionQueue(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, status: 'Approved' } 
          : app
      )
    );
    
    addNotification({
      id: `notif-${Date.now()}`,
      type: 'success',
      message: `Application ${id} has been approved`,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    alert(`✅ Application Approved!\n\nApplication ID: ${id}\n${remarks ? `Remarks: ${remarks}` : 'No remarks added'}\n\nNotification sent to applicant.`);
  };

  const handleReject = (id: string, reason: string) => {
    setAdmissionQueue(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, status: 'Rejected' } 
          : app
      )
    );
    
    addNotification({
      id: `notif-${Date.now()}`,
      type: 'error',
      message: `Application ${id} has been rejected`,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    alert(`❌ Application Rejected\n\nApplication ID: ${id}\nReason: ${reason}\n\nNotification sent to applicant.`);
  };

  const handleProcessHostel = (reqId: string) => {
    // Search in hostelRequests state
    const request = hostelRequests.find(r => r.id === reqId);
    if (request) {
      setSelectedHostelRequest(request);
      setActiveModal('hostel');
    } else {
      console.error('Hostel request not found:', reqId);
      alert('Error: Hostel request not found. Please try again.');
    }
  };

  const handleAllocateRoom = (id: string, allocatedRoom: string, remarks?: string) => {
    // Update the hostel request status
    setHostelRequests(prev => 
      prev.map(req =>
        req.id === id ? { ...req, status: 'Approved', room: allocatedRoom } : req
      )
    );
    
    addNotification({
      id: `notif-${Date.now()}`,
      type: 'success',
      message: `Hostel room ${allocatedRoom} allocated to ${hostelRequests.find(r => r.id === id)?.student}`,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    alert(`✅ Room Allocated Successfully!\n\nRequest ID: ${id}\nAllocated Room: ${allocatedRoom}\n${remarks ? `Remarks: ${remarks}` : 'No remarks added'}\n\nNotification sent to student.`);
  };

  const handleRejectHostel = (id: string, reason: string) => {
    // Update the hostel request status
    setHostelRequests(prev => 
      prev.map(req =>
        req.id === id ? { ...req, status: 'Rejected' } : req
      )
    );
    
    addNotification({
      id: `notif-${Date.now()}`,
      type: 'error',
      message: `Hostel request ${id} has been rejected`,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    alert(`❌ Hostel Request Rejected\n\nRequest ID: ${id}\nReason: ${reason}\n\nNotification sent to student.`);
  };

  // Detailed data for modals
  const allAdmissions = [
    ...admissionQueue,
    { id: 'APP-2025-1006', name: 'Neha Gupta', course: 'B.Tech CSE', date: '2025-09-28', status: 'Approved', email: 'neha.g@email.com', phone: '+91-9876543260', dob: '2006-04-12', address: '987 Green Park, Delhi', previousSchool: 'Modern School', percentage: 94.1, guardianName: 'Mr. Gupta', guardianPhone: '+91-9876543261' },
    { id: 'APP-2025-1007', name: 'Aditya Kumar', course: 'M.Tech AI', date: '2025-09-27', status: 'Rejected', email: 'aditya.k@email.com', phone: '+91-9876543270', dob: '1998-09-08', address: '543 Tech Park, Hyderabad', previousSchool: 'NIT Warangal', percentage: 72.3, guardianName: 'Mrs. Kumar', guardianPhone: '+91-9876543271' },
    { id: 'APP-2025-1008', name: 'Pooja Singh', course: 'MBA', date: '2025-09-26', status: 'Approved', email: 'pooja.s@email.com', phone: '+91-9876543280', dob: '2001-12-05', address: '234 Business Bay, Gurgaon', previousSchool: 'Symbiosis Pune', percentage: 87.9, guardianName: 'Mr. Singh', guardianPhone: '+91-9876543281' },
  ];

  const todayFeeDetails = [
    { id: 1, student: 'Rahul Sharma', amount: 25000, time: '09:15 AM', mode: 'UPI', receipt: 'RCP-001' },
    { id: 2, student: 'Priya Patel', amount: 18000, time: '10:30 AM', mode: 'Card', receipt: 'RCP-002' },
    { id: 3, student: 'Amit Verma', amount: 32000, time: '11:45 AM', mode: 'Online', receipt: 'RCP-003' },
    { id: 4, student: 'Sneha Reddy', amount: 15000, time: '01:20 PM', mode: 'Cash', receipt: 'RCP-004' },
    { id: 5, student: 'Karthik Nair', amount: 28000, time: '02:50 PM', mode: 'UPI', receipt: 'RCP-005' },
    { id: 6, student: 'Divya Kumar', amount: 27000, time: '03:30 PM', mode: 'Card', receipt: 'RCP-006' },
  ];

  const allHostelRequests = hostelRequests;

  const handleExportModal = (type: string) => {
    alert(`Exporting ${type} data to CSV...`);
  };

  // Bulk Import Handler
  const handleBulkImport = async () => {
    if (!bulkImportFile) {
      alert('Please select a file to import');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    // Simulate file processing
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        // Skip header row
        const dataLines = lines.slice(1);
        const newApplications: any[] = [];

        // Simulate progressive import
        let processedCount = 0;
        const intervalId = setInterval(() => {
          if (processedCount < dataLines.length) {
            const line = dataLines[processedCount];
            const [name, course, email, phone, percentage] = line.split(',');
            
            if (name && course) {
              newApplications.push({
                id: `APP-2025-${1100 + processedCount}`,
                name: name.trim(),
                course: course.trim(),
                email: email?.trim() || 'email@example.com',
                phone: phone?.trim() || '+91-9999999999',
                date: new Date().toISOString().split('T')[0],
                status: 'Pending',
                percentage: parseFloat(percentage) || 0,
                dob: '2000-01-01',
                address: 'Address to be updated',
                previousSchool: 'School name to be updated',
                guardianName: 'Guardian name',
                guardianPhone: '+91-9999999999'
              });
            }

            processedCount++;
            setImportProgress(Math.round((processedCount / dataLines.length) * 100));
          } else {
            clearInterval(intervalId);
            
            // Add to admission queue
            setAdmissionQueue(prev => [...newApplications, ...prev]);
            
            setIsImporting(false);
            setImportProgress(100);
            setBulkImportFile(null);
            setShowBulkImportModal(false);
            
            addNotification({
              id: `notif-${Date.now()}`,
              type: 'success',
              message: `Successfully imported ${newApplications.length} applications`,
              timestamp: new Date().toISOString(),
              read: false
            });

            alert(`✅ Import Successful!\n\n${newApplications.length} applications added to the queue.\n\nDatabase updated automatically.`);
          }
        }, 100); // Simulate processing time
      } catch (error) {
        setIsImporting(false);
        alert('Error processing file. Please check the format.');
      }
    };

    reader.readAsText(bulkImportFile);
  };

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Clerk Dashboard - {currentUser?.name || 'Clerk'}
        </h1>
        <p className="text-gray-600">Manage admissions, fees, hostel allocations, and daily operations</p>
        
        {/* Quick Action Buttons */}
        <div className="flex gap-3 mt-4 flex-wrap">
          <button 
            onClick={() => setActiveModal('admissions')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Process Admissions
          </button>
          <button 
            onClick={() => setActiveModal('fees')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            Record Payment
          </button>
          <button 
            onClick={() => setActiveModal('hostel')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Allocate Hostel
          </button>
          <button 
            onClick={() => setActiveModal('verification')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Verify Documents
          </button>
        </div>
      </div>

      {/* Key Metrics - Clerk Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div 
          onClick={() => setActiveModal('admissions')}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <UserPlus className="w-8 h-8" />
            <span className="text-2xl font-bold">{clerkStats.pendingAdmissions}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Pending Admissions</h3>
          <p className="text-xs opacity-75 mt-1">Requires action</p>
        </div>

        <div 
          onClick={() => setActiveModal('fees')}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <Receipt className="w-8 h-8" />
            <span className="text-2xl font-bold">₹{(clerkStats.todayFeeCollection / 1000).toFixed(0)}k</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Today's Collection</h3>
          <p className="text-xs opacity-75 mt-1">{clerkStats.todayCollectionCount} transactions</p>
        </div>

        <div 
          onClick={() => setActiveModal('verification')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8" />
            <span className="text-2xl font-bold">{clerkStats.pendingVerification}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Pending Verification</h3>
          <p className="text-xs opacity-75 mt-1">Documents to verify</p>
        </div>

        <div 
          onClick={() => setActiveModal('hostel')}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <Home className="w-8 h-8" />
            <span className="text-2xl font-bold">{clerkStats.hostelRequests}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Hostel Requests</h3>
          <p className="text-xs opacity-75 mt-1">Allocation pending</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Attendance Marked</p>
              <p className="text-2xl font-bold text-gray-800">{clerkStats.todayAttendanceMarked}</p>
              <p className="text-xs text-gray-500 mt-1">Out of {clerkStats.totalStudents} students</p>
            </div>
            <ClipboardCheck className="w-10 h-10 text-indigo-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">ID Cards Generated</p>
              <p className="text-2xl font-bold text-gray-800">{clerkStats.idCardsGenerated}</p>
              <p className="text-xs text-gray-500 mt-1">Today</p>
            </div>
            <FileText className="w-10 h-10 text-cyan-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Certificates Issued</p>
              <p className="text-2xl font-bold text-gray-800">{clerkStats.certificatesIssued}</p>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </div>
            <Download className="w-10 h-10 text-amber-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Pending Documents</p>
              <p className="text-2xl font-bold text-gray-800">{clerkStats.pendingDocuments}</p>
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Requires attention
              </p>
            </div>
            <BookOpen className="w-10 h-10 text-red-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Exam Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{clerkStats.pendingExamTasks}</p>
              <p className="text-xs text-gray-500 mt-1">Approvals & uploads</p>
            </div>
            <BookOpen className="w-10 h-10 text-orange-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Payment Approvals</p>
              <p className="text-2xl font-bold text-gray-800">{clerkStats.pendingPaymentApprovals}</p>
              <p className="text-xs text-gray-500 mt-1">Online transactions</p>
            </div>
            <CheckCircle className="w-10 h-10 text-emerald-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Fee Collection Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Weekly Fee Collection
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={feeCollectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#10b981" name="Amount (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Application Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Application Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={applicationStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {applicationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pending Admissions Queue */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-orange-600" />
              Admission Queue
            </h3>
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-semibold">
              {admissionQueue.length} pending
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {admissionQueue.map((application) => (
              <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{application.name}</h4>
                    <p className="text-sm text-gray-600">{application.course}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    application.status === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {application.status}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {application.date}
                  </span>
                  <button
                    onClick={() => handleProcessAdmission(application)}
                    className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600 transition-colors"
                  >
                    Process
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hostel Requests Queue */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Home className="w-5 h-5 mr-2 text-blue-600" />
              Hostel Requests
            </h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
              {hostelRequests.filter(r => r.status === 'Pending').length} pending
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {hostelRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{request.student}</h4>
                    <p className="text-sm text-gray-600">Preferred: {request.room}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    request.status === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {request.date}
                  </span>
                  {request.status === 'Pending' && (
                    <button
                      onClick={() => handleProcessHostel(request.id)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      Allocate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Panels - Attendance & ID Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Attendance Marking */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <ClipboardCheck className="w-5 h-5 mr-2 text-indigo-600" />
              Mark Attendance
            </h3>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-semibold">
              {clerkStats.todayAttendanceMarked}/{clerkStats.totalStudents}
            </span>
          </div>
          <div className="space-y-3">
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select Class</option>
              <option value="btech-cse-1">B.Tech CSE - Semester 1</option>
              <option value="btech-cse-3">B.Tech CSE - Semester 3</option>
              <option value="btech-ece-1">B.Tech ECE - Semester 1</option>
              <option value="mba-1">MBA - Semester 1</option>
              <option value="bsc-cs-3">B.Sc CS - Semester 3</option>
            </select>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select Subject</option>
              <option value="ds">Data Structures</option>
              <option value="dbms">Database Management</option>
              <option value="os">Operating Systems</option>
              <option value="networks">Computer Networks</option>
            </select>
            <button 
              onClick={() => {
                addNotification({
                  id: `notif-${Date.now()}`,
                  type: 'success',
                  message: 'Attendance marked successfully for the class',
                  timestamp: new Date().toISOString(),
                  read: false
                });
              }}
              className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Mark Attendance
            </button>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Today's Progress:</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${(clerkStats.todayAttendanceMarked / clerkStats.totalStudents) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{((clerkStats.todayAttendanceMarked / clerkStats.totalStudents) * 100).toFixed(1)}% Complete</p>
            </div>
          </div>
        </div>

        {/* ID Card Generation */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-cyan-600" />
              ID Card Generation
            </h3>
            <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full font-semibold">
              {clerkStats.idCardsGenerated} today
            </span>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500">
                <p className="text-xs text-gray-600">Certificates Issued</p>
                <p className="text-xl font-bold text-amber-600">{clerkStats.certificatesIssued}</p>
                <p className="text-xs text-gray-500 mt-1">This week</p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg border-l-4 border-cyan-500">
                <p className="text-xs text-gray-600">ID Cards</p>
                <p className="text-xl font-bold text-cyan-600">{clerkStats.idCardsGenerated}</p>
                <p className="text-xs text-gray-500 mt-1">Today</p>
              </div>
            </div>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="">Select Document Type</option>
              <option value="idcard">Student ID Card</option>
              <option value="bonafide">Bonafide Certificate</option>
              <option value="tc">Transfer Certificate</option>
              <option value="conduct">Conduct Certificate</option>
            </select>
            <input 
              type="text" 
              placeholder="Enter Student ID" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button 
              onClick={() => {
                addNotification({
                  id: `notif-${Date.now()}`,
                  type: 'success',
                  message: 'Document generated and ready for printing',
                  timestamp: new Date().toISOString(),
                  read: false
                });
              }}
              className="w-full bg-cyan-600 text-white px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
            >
              Generate Document
            </button>
            <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              <Download className="w-4 h-4 inline mr-2" />
              View Generated Documents
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity Panel */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {activity.type === 'admission' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {activity.type === 'fee' && <DollarSign className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'hostel' && <Home className="w-5 h-5 text-purple-600" />}
                  {activity.type === 'verification' && <Shield className="w-5 h-5 text-cyan-600" />}
                  {activity.type === 'idcard' && <FileText className="w-5 h-5 text-amber-600" />}
                  {activity.type === 'attendance' && <ClipboardCheck className="w-5 h-5 text-indigo-600" />}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-600">
                      {activity.student || activity.class}
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
            Pending Alerts
          </h3>
          <div className="space-y-3">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
              <div className="flex items-start gap-2">
                <UserPlus className="w-4 h-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">New Admissions</p>
                  <p className="text-xs text-gray-600">{clerkStats.pendingAdmissions} applications awaiting processing</p>
                  <button 
                    onClick={() => setActiveModal('admissions')}
                    className="text-xs text-orange-600 hover:underline mt-1 font-medium"
                  >
                    View All →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Payment Approvals</p>
                  <p className="text-xs text-gray-600">{clerkStats.pendingPaymentApprovals} online payments need approval</p>
                  <button 
                    onClick={() => setActiveModal('fees')}
                    className="text-xs text-emerald-600 hover:underline mt-1 font-medium"
                  >
                    Review Now →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
              <div className="flex items-start gap-2">
                <Home className="w-4 h-4 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Hostel Requests</p>
                  <p className="text-xs text-gray-600">{clerkStats.hostelRequests} students waiting for allocation</p>
                  <button 
                    onClick={() => setActiveModal('hostel')}
                    className="text-xs text-purple-600 hover:underline mt-1 font-medium"
                  >
                    Allocate →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Exam Tasks</p>
                  <p className="text-xs text-gray-600">{clerkStats.pendingExamTasks} exam approvals & mark uploads pending</p>
                  <button className="text-xs text-orange-600 hover:underline mt-1 font-medium">
                    View Tasks →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modals */}
      {/* Admissions Detail Modal */}
      <DetailModal
        isOpen={activeModal === 'admissions'}
        onClose={() => setActiveModal(null)}
        title="Admission Applications"
        subtitle="Complete application list"
        onExport={() => handleExportModal('Admissions')}
        showFilter
        showSearch
      >
        <div className="space-y-4">
          {/* Bulk Import Section */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Bulk Import Admissions</h4>
                  <p className="text-xs text-gray-600">Upload CSV/Excel file to import multiple applications</p>
                </div>
              </div>
              <button 
                onClick={() => setShowBulkImportModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium"
              >
                Import File
              </button>
            </div>
            <p className="text-xs text-gray-500 italic">
              Format: Name, Course, Email, Phone, Percentage (CSV format)
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <p className="text-sm text-gray-600">Pending</p>
              <h3 className="text-xl font-bold text-orange-600">
                {allAdmissions.filter(a => a.status === 'Pending').length}
              </h3>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Under Review</p>
              <h3 className="text-xl font-bold text-blue-600">
                {allAdmissions.filter(a => a.status === 'Under Review').length}
              </h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Approved</p>
              <h3 className="text-xl font-bold text-green-600">
                {allAdmissions.filter(a => a.status === 'Approved').length}
              </h3>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-gray-600">Rejected</p>
              <h3 className="text-xl font-bold text-red-600">
                {allAdmissions.filter(a => a.status === 'Rejected').length}
              </h3>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Application ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Course</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allAdmissions.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{app.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{app.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{app.course}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{app.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      app.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {app.status === 'Pending' || app.status === 'Under Review' ? (
                      <button 
                        onClick={() => handleProcessAdmission(app)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Process
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailModal>

      {/* Fee Collection Details Modal */}
      <DetailModal
        isOpen={activeModal === 'fees'}
        onClose={() => setActiveModal(null)}
        title="Today's Fee Collection"
        subtitle={`Total collected: ₹${clerkStats.todayFeeCollection.toLocaleString()}`}
        onExport={() => handleExportModal('Fees')}
        showFilter
        showSearch
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Total Collection</p>
              <h3 className="text-xl font-bold text-green-600">
                ₹{clerkStats.todayFeeCollection.toLocaleString()}
              </h3>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Transactions</p>
              <h3 className="text-xl font-bold text-blue-600">
                {todayFeeDetails.length}
              </h3>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm text-gray-600">Average Amount</p>
              <h3 className="text-xl font-bold text-purple-600">
                ₹{Math.round(clerkStats.todayFeeCollection / todayFeeDetails.length).toLocaleString()}
              </h3>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment Mode</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {todayFeeDetails.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{payment.student}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{payment.time}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {payment.mode}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-blue-600 hover:underline text-xs">
                      {payment.receipt}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailModal>

      {/* Hostel Requests Detail Modal */}
      <DetailModal
        isOpen={activeModal === 'hostel'}
        onClose={() => setActiveModal(null)}
        title="Hostel Allocation Requests"
        subtitle="Complete request list"
        onExport={() => handleExportModal('Hostel')}
        showFilter
        showSearch
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <p className="text-sm text-gray-600">Pending</p>
              <h3 className="text-xl font-bold text-orange-600">
                {allHostelRequests.filter(r => r.status === 'Pending').length}
              </h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Approved</p>
              <h3 className="text-xl font-bold text-green-600">
                {allHostelRequests.filter(r => r.status === 'Approved').length}
              </h3>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-gray-600">Rejected</p>
              <h3 className="text-xl font-bold text-red-600">
                {allHostelRequests.filter(r => r.status === 'Rejected').length}
              </h3>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Request ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Preferred Block</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allHostelRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{request.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{request.student}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{request.room}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{request.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      request.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      request.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {request.status === 'Pending' ? (
                      <button 
                        onClick={() => handleProcessHostel(request.id)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Allocate
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailModal>

      {/* Document Verification Modal - Traditional Clerk Function */}
      <DetailModal
        isOpen={activeModal === 'verification'}
        onClose={() => setActiveModal(null)}
        title="Document Verification Queue"
        subtitle="Verify and approve student documents"
        onExport={() => handleExportModal('Documents')}
        showFilter
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <p className="text-sm text-gray-600">Pending</p>
              <h3 className="text-xl font-bold text-orange-600">
                {documentVerificationQueue.filter(d => d.status === 'Pending').length}
              </h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Verified</p>
              <h3 className="text-xl font-bold text-green-600">
                {documentVerificationQueue.filter(d => d.status === 'Verified').length}
              </h3>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-gray-600">Rejected</p>
              <h3 className="text-xl font-bold text-red-600">
                {documentVerificationQueue.filter(d => d.status === 'Rejected').length}
              </h3>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Doc ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Document Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Submitted On</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documentVerificationQueue.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{doc.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{doc.studentId}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{doc.studentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{doc.documentType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{doc.submittedOn}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      doc.status === 'Verified' ? 'bg-green-100 text-green-700' :
                      doc.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {doc.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setDocumentVerificationQueue(prev =>
                              prev.map(d => d.id === doc.id ? { ...d, status: 'Verified', remarks: 'Verified by clerk' } : d)
                            );
                            addNotification({
                              id: `notif-${Date.now()}`,
                              type: 'success',
                              message: `Document ${doc.id} verified successfully`,
                              timestamp: new Date().toISOString(),
                              read: false
                            });
                          }}
                          className="text-green-600 hover:underline font-medium text-xs"
                        >
                          Verify
                        </button>
                        <button 
                          onClick={() => {
                            const reason = prompt('Rejection reason:');
                            if (reason) {
                              setDocumentVerificationQueue(prev =>
                                prev.map(d => d.id === doc.id ? { ...d, status: 'Rejected', remarks: reason } : d)
                              );
                              addNotification({
                                id: `notif-${Date.now()}`,
                                type: 'error',
                                message: `Document ${doc.id} rejected`,
                                timestamp: new Date().toISOString(),
                                read: false
                              });
                            }
                          }}
                          className="text-red-600 hover:underline font-medium text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">{doc.remarks}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailModal>

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={activeModal === 'approval'}
        onClose={() => {
          setActiveModal(null);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Hostel Allocation Modal */}
      <HostelAllocationModal
        isOpen={activeModal === 'hostel'}
        onClose={() => {
          setActiveModal(null);
          setSelectedHostelRequest(null);
        }}
        request={selectedHostelRequest}
        onApprove={handleAllocateRoom}
        onReject={handleRejectHostel}
      />

      {/* Bulk Import Modal */}
      {showBulkImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Download className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Bulk Import Admissions</h3>
                    <p className="text-sm text-gray-600">Upload CSV/Excel file with student data</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowBulkImportModal(false);
                    setBulkImportFile(null);
                    setImportProgress(0);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* File Format Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Required CSV Format:</h4>
                <div className="bg-white rounded p-3 font-mono text-xs text-gray-700">
                  <p className="font-semibold text-blue-600">Name,Course,Email,Phone,Percentage</p>
                  <p className="text-gray-500 mt-1">Rajesh Kumar,B.Tech CSE,rajesh@email.com,+91-9876543210,92.5</p>
                  <p className="text-gray-500">Priya Sharma,B.Tech ECE,priya@email.com,+91-9876543220,89.3</p>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-semibold">Note:</span> First row must be the header. Auto-database update on import.
                </p>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => setBulkImportFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="bulk-import-file"
                />
                <label htmlFor="bulk-import-file" className="cursor-pointer">
                  <Download className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  {bulkImportFile ? (
                    <div>
                      <p className="text-sm font-semibold text-green-600">✓ {bulkImportFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Click to select file</p>
                      <p className="text-xs text-gray-500 mt-1">CSV or Excel format</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Progress Bar */}
              {isImporting && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Importing...</span>
                    <span className="text-sm font-semibold text-blue-600">{importProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowBulkImportModal(false);
                    setBulkImportFile(null);
                    setImportProgress(0);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={isImporting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkImport}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={!bulkImportFile || isImporting}
                >
                  {isImporting ? 'Importing...' : 'Import Applications'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClerkDashboard;
