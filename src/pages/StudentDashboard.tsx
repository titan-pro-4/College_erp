import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  GraduationCap, 
  DollarSign, 
  FileText, 
  Home, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Book,
  Download,
  Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import DetailModal from '../components/DetailModal';
import jsPDF from 'jspdf';

const StudentDashboard: React.FC = () => {
  const { currentUser } = useApp();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Mock data specific to the student
    const studentStats = {
    name: currentUser?.name || 'Student',
    rollNo: 'CS2023001',
    class: 'B.Tech CSE - 3rd Year',
    cgpa: 8.5,
    attendance: 87,
    attendancePercentage: 87,
    currentSemester: 6,
    pendingFees: 15000,
    totalFees: 50000,
    paidFees: 35000,
    hostelRoom: 'A-204',
    hasHostel: true, // Set to false for students without hostel
    upcomingExams: 3,
  };

  const feesBreakdown = [
    { month: 'Jul', paid: 10000 },
    { month: 'Aug', paid: 8000 },
    { month: 'Sep', paid: 12000 },
    { month: 'Oct', paid: 5000 },
    { month: 'Nov', paid: 0 },
    { month: 'Dec', paid: 0 },
  ];

  const attendanceData = [
    { month: 'Jul', percentage: 92 },
    { month: 'Aug', percentage: 88 },
    { month: 'Sep', percentage: 85 },
    { month: 'Oct', percentage: 87 },
  ];

  const recentExams = [
    { subject: 'Data Structures', date: '2025-09-15', marks: 85, total: 100, status: 'Completed' },
    { subject: 'Algorithms', date: '2025-09-18', marks: 78, total: 100, status: 'Completed' },
    { subject: 'Database Systems', date: '2025-10-05', marks: null, total: 100, status: 'Upcoming' },
    { subject: 'Web Development', date: '2025-10-08', marks: null, total: 100, status: 'Upcoming' },
  ];

  const feeTransactions = [
    { id: 1, date: '2025-09-01', amount: 12000, type: 'Semester Fee', status: 'Paid', receipt: 'RCP-2025-001' },
    { id: 2, date: '2025-08-15', amount: 8000, type: 'Hostel Fee', status: 'Paid', receipt: 'RCP-2025-002' },
    { id: 3, date: '2025-11-01', amount: 15000, type: 'Semester Fee', status: 'Pending', receipt: null },
  ];

  // Detailed data for modals
  const cgpaDetails = [
    { semester: 'Semester 1', sgpa: 8.8, credits: 24, year: '2023-24' },
    { semester: 'Semester 2', sgpa: 8.6, credits: 24, year: '2023-24' },
    { semester: 'Semester 3', sgpa: 8.4, credits: 26, year: '2024-25' },
    { semester: 'Semester 4', sgpa: 8.3, credits: 26, year: '2024-25' },
    { semester: 'Semester 5', sgpa: 8.5, credits: 28, year: '2025-26' },
  ];

  const attendanceDetails = [
    { subject: 'Data Structures', attended: 42, total: 45, percentage: 93.3, professor: 'Dr. Kumar' },
    { subject: 'Algorithms', attended: 38, total: 45, percentage: 84.4, professor: 'Dr. Sharma' },
    { subject: 'Database Systems', attended: 40, total: 45, percentage: 88.9, professor: 'Prof. Patel' },
    { subject: 'Web Development', attended: 37, total: 45, percentage: 82.2, professor: 'Dr. Singh' },
    { subject: 'Operating Systems', attended: 41, total: 45, percentage: 91.1, professor: 'Prof. Reddy' },
  ];

  const allFeeTransactions = [
    { id: 1, date: '2025-09-01', amount: 12000, type: 'Semester Fee', status: 'Paid', receipt: 'RCP-2025-001', mode: 'Online' },
    { id: 2, date: '2025-08-15', amount: 8000, type: 'Hostel Fee', status: 'Paid', receipt: 'RCP-2025-002', mode: 'Card' },
    { id: 3, date: '2025-07-10', amount: 10000, type: 'Tuition Fee', status: 'Paid', receipt: 'RCP-2025-003', mode: 'UPI' },
    { id: 4, date: '2025-06-20', amount: 5000, type: 'Lab Fee', status: 'Paid', receipt: 'RCP-2025-004', mode: 'Cash' },
    { id: 5, date: '2025-11-01', amount: 12000, type: 'Semester Fee', status: 'Pending', receipt: null, mode: null },
    { id: 6, date: '2025-12-01', amount: 3000, type: 'Library Fee', status: 'Pending', receipt: null, mode: null },
  ];

  const allExams = [
    { subject: 'Data Structures', date: '2025-09-15', marks: 85, total: 100, status: 'Completed', grade: 'A', examType: 'Mid-Term' },
    { subject: 'Algorithms', date: '2025-09-18', marks: 78, total: 100, status: 'Completed', grade: 'B+', examType: 'Mid-Term' },
    { subject: 'Database Systems', date: '2025-10-05', marks: null, total: 100, status: 'Upcoming', grade: null, examType: 'Mid-Term' },
    { subject: 'Web Development', date: '2025-10-08', marks: null, total: 100, status: 'Upcoming', grade: null, examType: 'Mid-Term' },
    { subject: 'Operating Systems', date: '2025-10-12', marks: null, total: 100, status: 'Upcoming', grade: null, examType: 'Mid-Term' },
  ];

  // Helper function to convert data to CSV and download
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    // Get headers from the first object
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape values containing commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to generate and download receipt PDF
  const downloadReceipt = (transaction: any) => {
    const doc = new jsPDF();
    
    // College Header with gradient-like effect
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('College ERP System', 105, 18, { align: 'center' });
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Payment Receipt', 105, 30, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Receipt Info Box
    doc.setFillColor(240, 249, 255);
    doc.rect(20, 50, 170, 20, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.rect(20, 50, 170, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Receipt No: ${transaction.receipt}`, 25, 58);
    doc.text(`Date: ${transaction.date}`, 140, 58);
    doc.text(`Transaction ID: ${transaction.id || 'TXN' + Date.now()}`, 25, 65);
    
    // Student Details Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Student Information', 20, 85);
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, 88, 190, 88);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const leftCol = 25;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', leftCol, 98);
    doc.setFont('helvetica', 'normal');
    doc.text(studentStats.name, leftCol + 25, 98);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Roll No:', leftCol, 106);
    doc.setFont('helvetica', 'normal');
    doc.text(studentStats.rollNo, leftCol + 25, 106);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Program:', leftCol, 114);
    doc.setFont('helvetica', 'normal');
    doc.text(studentStats.class, leftCol + 25, 114);
    
    // Payment Details Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Payment Details', 20, 135);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 138, 190, 138);
    
    // Payment details in a box
    doc.setFillColor(250, 250, 250);
    doc.rect(20, 145, 170, 50, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(20, 145, 170, 50);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Fee Type:', 25, 155);
    doc.setFont('helvetica', 'normal');
    doc.text(transaction.type, 60, 155);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Mode:', 25, 165);
    doc.setFont('helvetica', 'normal');
    doc.text(transaction.mode || 'N/A', 60, 165);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', 25, 175);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(34, 197, 94);
    doc.text(transaction.status, 60, 175);
    doc.setTextColor(0, 0, 0);
    
    // Amount box - highlighted
    doc.setFillColor(37, 99, 235);
    doc.rect(20, 185, 170, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Total Amount Paid:', 25, 192);
    doc.setFontSize(12);
    doc.text(`₹${transaction.amount.toLocaleString()}`, 155, 192);
    
    // Reset color
    doc.setTextColor(0, 0, 0);
    
    // Thank you note
    doc.setFillColor(254, 249, 195);
    doc.rect(20, 210, 170, 15, 'F');
    doc.setDrawColor(251, 191, 36);
    doc.rect(20, 210, 170, 15);
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('Thank you for your payment!', 105, 219, { align: 'center' });
    
    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 265, 190, 265);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated receipt and does not require a signature.', 105, 273, { align: 'center' });
    doc.text('For queries, contact the accounts department at accounts@college.edu', 105, 280, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text('College ERP System © 2025', 105, 287, { align: 'center' });
    
    // Save PDF
    doc.save(`Receipt_${transaction.receipt}.pdf`);
  };

  const handleExportModal = (type: string) => {
    let dataToExport: any[] = [];
    let filename = '';

    switch (type) {
      case 'CGPA':
        dataToExport = cgpaDetails.map(sem => ({
          Semester: sem.semester,
          SGPA: sem.sgpa,
          Credits: sem.credits,
          Year: sem.year
        }));
        filename = 'CGPA_Details';
        break;
      case 'Attendance':
        dataToExport = attendanceDetails.map(subject => ({
          Subject: subject.subject,
          Attended: subject.attended,
          Total: subject.total,
          Percentage: subject.percentage.toFixed(1),
          Professor: subject.professor
        }));
        filename = 'Attendance_Details';
        break;
      case 'Fees':
        dataToExport = allFeeTransactions.map(txn => ({
          Date: txn.date,
          Type: txn.type,
          Amount: txn.amount,
          Mode: txn.mode || 'N/A',
          Status: txn.status,
          Receipt: txn.receipt || 'N/A'
        }));
        filename = 'Fee_Payment_History';
        break;
      case 'Exams':
        dataToExport = allExams.map(exam => ({
          Subject: exam.subject,
          Date: exam.date,
          Type: exam.examType,
          Marks: exam.marks !== null ? `${exam.marks}/${exam.total}` : 'Not graded',
          Grade: exam.grade || 'N/A',
          Status: exam.status
        }));
        filename = 'Exam_Schedule';
        break;
    }

    if (dataToExport.length > 0) {
      exportToCSV(dataToExport, filename);
    }
  };

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {currentUser?.name || 'Student'}!
        </h1>
        <p className="text-gray-600">Here's your academic overview and important updates</p>
      </div>

      {/* Key Metrics - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div 
          onClick={() => setActiveModal('cgpa')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <GraduationCap className="w-8 h-8" />
            <span className="text-2xl font-bold">{studentStats.cgpa}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">CGPA</h3>
          <p className="text-xs opacity-75 mt-1">Click to view details</p>
        </div>

        <div 
          onClick={() => setActiveModal('attendance')}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8" />
            <span className="text-2xl font-bold">{studentStats.attendancePercentage}%</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Attendance</h3>
          <p className="text-xs opacity-75 mt-1">Click to view details</p>
        </div>

        <div 
          onClick={() => setActiveModal('fees')}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <span className="text-2xl font-bold">₹{studentStats.pendingFees.toLocaleString()}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Pending Fees</h3>
          <p className="text-xs opacity-75 mt-1">Click to view details</p>
        </div>

        <div 
          onClick={() => setActiveModal('exams')}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <span className="text-2xl font-bold">{studentStats.upcomingExams}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Upcoming Exams</h3>
          <p className="text-xs opacity-75 mt-1">Click to view details</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Fees Payment Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
            Fee Payment History
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={feesBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="paid" fill="#8b5cf6" name="Amount Paid (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Attendance Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={2} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exam Schedule and Fee Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam Schedule */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Book className="w-5 h-5 mr-2 text-blue-600" />
            Exam Schedule & Results
          </h3>
          <div className="space-y-3">
            {recentExams.map((exam, index) => (
              <div key={index} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{exam.subject}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    exam.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {exam.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {exam.date}
                  </span>
                  {exam.marks !== null ? (
                    <span className="font-semibold text-blue-600">
                      {exam.marks}/{exam.total}
                    </span>
                  ) : (
                    <span className="text-gray-500 italic">Not graded</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Transactions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-600" />
            Recent Transactions
          </h3>
          <div className="space-y-3">
            {feeTransactions.map((transaction) => (
              <div key={transaction.id} className="border-l-4 border-purple-500 bg-gray-50 p-4 rounded-r-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{transaction.type}</h4>
                    <p className="text-xs text-gray-600 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {transaction.date}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'Paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-gray-800">₹{transaction.amount.toLocaleString()}</span>
                  {transaction.receipt && (
                    <button 
                      onClick={() => downloadReceipt(transaction)}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hostel Information Card - Conditional */}
      {studentStats.hasHostel ? (
        <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Your Hostel Information</h3>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  <span>Room: <strong>{studentStats.hostelRoom}</strong></span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Status: <strong>Active</strong></span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setActiveModal('hostel')}
              className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-gray-100 rounded-xl p-6 border-2 border-dashed border-gray-300">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Hostel Allocated</h3>
              <p className="text-gray-500 text-sm mb-4">You have not been allocated a hostel room yet</p>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Apply for Hostel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modals */}
      {/* CGPA Details Modal */}
      <DetailModal
        isOpen={activeModal === 'cgpa'}
        onClose={() => setActiveModal(null)}
        title="CGPA Breakdown"
        subtitle="Semester-wise performance"
        onExport={() => handleExportModal('CGPA')}
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-blue-600">
                  {studentStats.cgpa}
                </h3>
                <p className="text-sm text-gray-600">Cumulative GPA</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">Semester {studentStats.currentSemester}</p>
                <p className="text-sm text-gray-600">Current</p>
              </div>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Semester</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SGPA</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Credits</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Academic Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cgpaDetails.map((sem, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{sem.semester}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`font-semibold ${
                      sem.sgpa >= 8.5 ? 'text-green-600' :
                      sem.sgpa >= 7.5 ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {sem.sgpa}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{sem.credits}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{sem.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailModal>

      {/* Attendance Details Modal */}
      <DetailModal
        isOpen={activeModal === 'attendance'}
        onClose={() => setActiveModal(null)}
        title="Attendance Details"
        subtitle="Subject-wise attendance record"
        onExport={() => handleExportModal('Attendance')}
        showFilter
        showSearch
      >
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-green-600">
                  {studentStats.attendancePercentage}%
                </h3>
                <p className="text-sm text-gray-600">Overall Attendance</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {attendanceDetails.reduce((acc, s) => acc + s.attended, 0)} / {attendanceDetails.reduce((acc, s) => acc + s.total, 0)} Classes
                </p>
                <p className="text-xs text-gray-500">Attended / Total</p>
              </div>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Attended</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Percentage</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Professor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceDetails.map((subject, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{subject.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{subject.attended}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{subject.total}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`font-semibold px-2 py-1 rounded ${
                      subject.percentage >= 90 ? 'bg-green-100 text-green-700' :
                      subject.percentage >= 75 ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {subject.percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{subject.professor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailModal>

      {/* Fees Details Modal */}
      <DetailModal
        isOpen={activeModal === 'fees'}
        onClose={() => setActiveModal(null)}
        title="Fee Payment Details"
        subtitle="Complete transaction history"
        onExport={() => handleExportModal('Fees')}
        showFilter
        showSearch
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
              <p className="text-sm text-gray-600">Total Fees</p>
              <h3 className="text-xl font-bold text-gray-800">
                ₹{studentStats.totalFees.toLocaleString()}
              </h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Paid</p>
              <h3 className="text-xl font-bold text-green-600">
                ₹{studentStats.paidFees.toLocaleString()}
              </h3>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-gray-600">Pending</p>
              <h3 className="text-xl font-bold text-red-600">
                ₹{studentStats.pendingFees.toLocaleString()}
              </h3>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mode</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allFeeTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{transaction.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{transaction.type}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                    ₹{transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{transaction.mode || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      transaction.status === 'Paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {transaction.receipt ? (
                      <button className="text-blue-600 hover:underline text-xs">
                        {transaction.receipt}
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

      {/* Exams Details Modal */}
      <DetailModal
        isOpen={activeModal === 'exams'}
        onClose={() => setActiveModal(null)}
        title="Exam Schedule & Results"
        subtitle="Complete exam information"
        onExport={() => handleExportModal('Exams')}
        showFilter
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Completed Exams</p>
              <h3 className="text-xl font-bold text-green-600">
                {allExams.filter(e => e.status === 'Completed').length}
              </h3>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <p className="text-sm text-gray-600">Upcoming Exams</p>
              <h3 className="text-xl font-bold text-orange-600">
                {allExams.filter(e => e.status === 'Upcoming').length}
              </h3>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Marks</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Grade</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allExams.map((exam, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{exam.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{exam.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{exam.examType}</td>
                  <td className="px-4 py-3 text-sm">
                    {exam.marks !== null ? (
                      <span className="font-semibold text-gray-800">
                        {exam.marks}/{exam.total}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Not graded</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {exam.grade ? (
                      <span className={`font-semibold px-2 py-1 rounded ${
                        exam.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                        exam.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {exam.grade}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      exam.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {exam.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailModal>

      {/* Hostel Details Modal */}
      {studentStats.hasHostel && (
        <DetailModal
          isOpen={activeModal === 'hostel'}
          onClose={() => setActiveModal(null)}
          title="Hostel Details"
          subtitle="Your accommodation information"
        >
          <div className="space-y-6">
            {/* Room Information */}
            <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-indigo-900">Room Information</h3>
                <Home className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Room Number</p>
                  <p className="text-lg font-semibold text-gray-800">{studentStats.hostelRoom}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Floor</p>
                  <p className="text-lg font-semibold text-gray-800">2nd Floor</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Block</p>
                  <p className="text-lg font-semibold text-gray-800">A Block</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Room Type</p>
                  <p className="text-lg font-semibold text-gray-800">Triple Sharing</p>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Room Facilities</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Wi-Fi Access', 'Attached Bathroom', 'Study Table', 'Cupboard', 'Bed & Mattress', 'Common Kitchen'].map((facility, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warden Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Warden Contact</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Name:</strong> Dr. Rajesh Kumar
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Contact:</strong> +91 98765 43210
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> warden.blocka@college.edu
                </p>
              </div>
            </div>

            {/* Hostel Rules */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Important Information</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                  <span>Hostel fee: ₹8,000 per semester (Already included in fee structure)</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                  <span>Curfew time: 10:00 PM on weekdays, 11:00 PM on weekends</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                  <span>Mess timings: Breakfast 7-9 AM, Lunch 12-2 PM, Dinner 7-9 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </DetailModal>
      )}
    </div>
  );
};

export default StudentDashboard;
