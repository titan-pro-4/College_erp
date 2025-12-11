import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  FileText, 
  Upload, 
  Download,
  Clock,
  CheckCircle,
  TrendingUp,
  ClipboardCheck,
  AlertCircle,
  BarChart3,
  FileSpreadsheet
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DetailModal from '../components/DetailModal';
import { attendanceService } from '../services/attendanceService';
import { studentService } from '../services/studentService';

const FacultyDashboard: React.FC = () => {
  const { currentUser, addNotification } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'syllabus' | 'marks' | 'questions' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Grading modal state
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedGradingTask, setSelectedGradingTask] = useState<any>(null);
  const [studentGrades, setStudentGrades] = useState<Record<string, { marks: string; comments: string }>>({});
  
  // Attendance modal state
  const [showAttendanceDetailModal, setShowAttendanceDetailModal] = useState(false);
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState<any>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, boolean>>({});

  // Handle URL parameters to open specific sections
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveModal(section);
    }
  }, [searchParams]);

  // Function to open modal and update URL
  const openSection = (section: string) => {
    setActiveModal(section);
    setSearchParams({ section });
  };

  // Function to close modal and clear URL
  const closeModal = () => {
    setActiveModal(null);
    setSearchParams({});
  };

  // Mock faculty data
  const facultyStats = {
    assignedClasses: 4,
    totalStudents: 180,
    upcomingExams: 3,
    pendingGrading: 12,
    attendanceToday: 2,
    syllabusUploaded: 3,
    marksUploaded: 8,
  };

  const [assignedClasses, setAssignedClasses] = useState([
    { 
      id: 'CLS-001', 
      name: 'Data Structures', 
      code: 'CSE301', 
      program: 'B.Tech CSE', 
      semester: '3rd',
      students: 45, 
      schedule: 'Mon, Wed, Fri - 09:00 AM',
      attendanceMarked: false,
      syllabusUploaded: true,
      lastAttendance: '2025-10-02'
    },
    { 
      id: 'CLS-002', 
      name: 'Database Management', 
      code: 'CSE302', 
      program: 'B.Tech CSE', 
      semester: '3rd',
      students: 42, 
      schedule: 'Tue, Thu - 11:00 AM',
      attendanceMarked: false,
      syllabusUploaded: true,
      lastAttendance: '2025-09-30'
    },
    { 
      id: 'CLS-003', 
      name: 'Computer Networks', 
      code: 'CSE401', 
      program: 'B.Tech CSE', 
      semester: '4th',
      students: 48, 
      schedule: 'Mon, Wed - 02:00 PM',
      attendanceMarked: false,
      syllabusUploaded: false,
      lastAttendance: '2025-10-02'
    },
    { 
      id: 'CLS-004', 
      name: 'Software Engineering', 
      code: 'CSE303', 
      program: 'B.Tech CSE', 
      semester: '3rd',
      students: 45, 
      schedule: 'Tue, Thu - 03:30 PM',
      attendanceMarked: false,
      syllabusUploaded: true,
      lastAttendance: '2025-10-01'
    },
  ]);

  // Check attendance status on mount
  useEffect(() => {
    const checkTodayAttendance = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Check each class for today's attendance
      const updatedClasses = await Promise.all(
        assignedClasses.map(async (cls) => {
          try {
            const records = await attendanceService.getByCourseAndSubject(cls.code, cls.name);
            const todayRecords = records?.filter((r: any) => {
              const recordDate = new Date(r.date).toISOString().split('T')[0];
              return recordDate === today;
            });
            
            return {
              ...cls,
              attendanceMarked: todayRecords && todayRecords.length > 0,
              lastAttendance: todayRecords && todayRecords.length > 0 ? today : cls.lastAttendance
            };
          } catch (error) {
            console.error('Error checking attendance:', error);
            return cls;
          }
        })
      );
      
      setAssignedClasses(updatedClasses);
    };

    checkTodayAttendance();
  }, []);

  const upcomingExams = [
    {
      id: 'EXM-001',
      subject: 'Data Structures',
      code: 'CSE301',
      date: '2025-10-15',
      time: '09:00 AM - 12:00 PM',
      room: 'Room 201',
      students: 45,
      questionsUploaded: true,
      marksUploaded: false,
      type: 'Mid-Semester'
    },
    {
      id: 'EXM-002',
      subject: 'Database Management',
      code: 'CSE302',
      date: '2025-10-18',
      time: '02:00 PM - 05:00 PM',
      room: 'Room 305',
      students: 42,
      questionsUploaded: false,
      marksUploaded: false,
      type: 'Mid-Semester'
    },
    {
      id: 'EXM-003',
      subject: 'Computer Networks',
      code: 'CSE401',
      date: '2025-10-20',
      time: '09:00 AM - 12:00 PM',
      room: 'Room 102',
      students: 48,
      questionsUploaded: true,
      marksUploaded: false,
      type: 'Mid-Semester'
    },
  ];

  const pendingGradingTasks = [
    { id: 'GRD-001', subject: 'Data Structures', type: 'Assignment 3', students: 45, dueDate: '2025-10-05', submitted: 38, maxMarks: 50 },
    { id: 'GRD-002', subject: 'Database Management', type: 'Quiz 2', students: 42, dueDate: '2025-10-06', submitted: 42, maxMarks: 25 },
    { id: 'GRD-003', subject: 'Software Engineering', type: 'Project Phase 1', students: 45, dueDate: '2025-10-08', submitted: 35, maxMarks: 100 },
  ];

  // Mock student data for grading
  const generateStudentsForTask = (taskId: string, count: number) => {
    const students = [];
    for (let i = 1; i <= count; i++) {
      students.push({
        id: `STU-${taskId}-${String(i).padStart(3, '0')}`,
        rollNo: `2023CSE${String(i).padStart(3, '0')}`,
        name: `Student ${i}`,
        submittedDate: `2025-10-0${Math.min(i % 5 + 1, 9)}`,
        hasSubmitted: i <= count
      });
    }
    return students;
  };

  const studentPerformanceData = [
    { range: '90-100', count: 15, color: '#10b981' },
    { range: '80-89', count: 35, color: '#3b82f6' },
    { range: '70-79', count: 48, color: '#f59e0b' },
    { range: '60-69', count: 32, color: '#ef4444' },
    { range: '<60', count: 12, color: '#dc2626' },
  ];

  const attendanceTrend = [
    { day: 'Mon', present: 165, absent: 15 },
    { day: 'Tue', present: 158, absent: 22 },
    { day: 'Wed', present: 172, absent: 8 },
    { day: 'Thu', present: 168, absent: 12 },
    { day: 'Fri', present: 175, absent: 5 },
  ];

  const recentActivity = [
    { action: 'Marked attendance', class: 'Data Structures', time: '30 mins ago', type: 'attendance' },
    { action: 'Uploaded syllabus', class: 'Computer Networks', time: '2 hours ago', type: 'upload' },
    { action: 'Graded assignments', class: 'Database Management', time: '5 hours ago', type: 'grading' },
    { action: 'Uploaded exam questions', class: 'Data Structures', time: '1 day ago', type: 'exam' },
  ];

  const handleMarkAttendance = async (classId: string) => {
    const classData = assignedClasses.find(c => c.id === classId);
    if (!classData) return;

    try {
      // Open detailed attendance modal instead of just marking all present
      setSelectedClassForAttendance(classData);
      setShowAttendanceDetailModal(true);
      
      // Initialize attendance records for all students as present by default
      const initialRecords: Record<string, boolean> = {};
      for (let i = 1; i <= classData.students; i++) {
        initialRecords[`STU-${String(i).padStart(3, '0')}`] = true;
      }
      setAttendanceRecords(initialRecords);
      
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance. Please try again.');
    }
  };

  const handleSaveAttendance = async () => {
    if (!selectedClassForAttendance) return;

    try {
      if (Object.keys(attendanceRecords).length === 0) {
        alert('Please mark attendance for at least one student before saving.');
        return;
      }
      
      const today = new Date();
      
      // Fetch all students from database to get UUIDs
      let dbStudents;
      try {
        dbStudents = await studentService.getAll();
      } catch (studentError) {
        throw new Error(`Failed to fetch students: ${studentError instanceof Error ? studentError.message : 'Unknown error'}`);
      }
      
      // Create attendance records for marked students
      // Use a Set to track used student UUIDs and prevent duplicates
      const usedStudentIds = new Set<string>();
      const records = [];
      
      for (const [studentKey, isPresent] of Object.entries(attendanceRecords)) {
        if (!dbStudents || dbStudents.length === 0) {
          console.warn('⚠️ No students found in database, skipping attendance save');
          alert('No students found in database. Please add students first.');
          return;
        }
        
        // Map mock student to real database student, but only use each DB student once
        const studentIndex = parseInt(studentKey.replace('STU-', '')) - 1;
        const dbStudentIndex = studentIndex % dbStudents.length;
        const dbStudent = dbStudents[dbStudentIndex];
        const studentUUID = (dbStudent as any).id;
        
        // Skip if we've already added this student (prevent duplicates)
        if (usedStudentIds.has(studentUUID)) {
          continue;
        }
        
        usedStudentIds.add(studentUUID);
        
        records.push({
          student_id: studentUUID,
          course: selectedClassForAttendance.code,
          subject: selectedClassForAttendance.name,
          date: today,
          status: isPresent ? 'Present' as const : 'Absent' as const
        });
      }

      // Save to database
      await attendanceService.bulkMarkAttendance(records);

      // Update local state
      setAssignedClasses(prev => 
        prev.map(cls => 
          cls.id === selectedClassForAttendance.id 
            ? { ...cls, attendanceMarked: true, lastAttendance: today.toISOString().split('T')[0] }
            : cls
        )
      );

      addNotification({
        id: `notif-${Date.now()}`,
        type: 'success',
        message: `Attendance marked for ${selectedClassForAttendance.name}`,
        timestamp: new Date().toISOString(),
        read: false
      });

      const presentCount = Object.values(attendanceRecords).filter(v => v).length;
      const absentCount = Object.values(attendanceRecords).filter(v => !v).length;
      
      alert(`Attendance Saved Successfully!\n\nClass: ${selectedClassForAttendance.name}\nPresent: ${presentCount}\nAbsent: ${absentCount}\nTotal Marked: ${records.length}`);
      
      setShowAttendanceDetailModal(false);
      setSelectedClassForAttendance(null);
      setAttendanceRecords({});
      
    } catch (error) {
      console.error('Error saving attendance:', error);
      
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to save attendance: ${errorMsg}`);
    }
  };

  const handleUploadFile = () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowUploadModal(false);
          setSelectedFile(null);
          
          addNotification({
            id: `notif-${Date.now()}`,
            type: 'success',
            message: `${uploadType} uploaded successfully`,
            timestamp: new Date().toISOString(),
            read: false
          });
          
          alert(`✅ Upload Successful!\n\n${uploadType} has been uploaded and is now available to students.`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleExportPerformance = () => {
    addNotification({
      id: `notif-${Date.now()}`,
      type: 'success',
      message: 'Performance report exported successfully',
      timestamp: new Date().toISOString(),
      read: false
    });
    
    // Simulate CSV generation
    const csvData = [
      'Student Name,Roll No,Attendance %,Average Marks,Grade',
      ...Array.from({ length: 10 }, (_, i) => {
        const attendance = Math.floor(Math.random() * 20) + 75;
        const marks = Math.floor(Math.random() * 30) + 65;
        const grade = marks >= 90 ? 'A+' : marks >= 80 ? 'A' : marks >= 70 ? 'B' : marks >= 60 ? 'C' : 'D';
        return `Student ${i + 1},2023CSE${String(i + 1).padStart(3, '0')},${attendance}%,${marks},${grade}`;
      })
    ].join('\n');
    
    alert(`📊 Performance Report Exported!\n\nFormat: CSV\nStudents: 180\nIncludes:\n• Student names and roll numbers\n• Attendance percentage\n• Average marks across all subjects\n• Letter grades\n\nFile: Performance_Report_${new Date().toISOString().split('T')[0]}.csv\n\nDownload started...`);
  };

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Faculty Dashboard - {currentUser?.name || 'Faculty'}
        </h1>
        <p className="text-gray-600">Manage your classes, exams, and student performance</p>
        
        {/* Quick Action Buttons */}
        <div className="flex gap-3 mt-4 flex-wrap">
          <button 
            onClick={() => openSection('classes')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            My Classes
          </button>
          <button 
            onClick={() => openSection('exams')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Upcoming Exams
          </button>
          <button 
            onClick={() => openSection('grading')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <ClipboardCheck className="w-4 h-4" />
            Pending Grading
          </button>
          <button 
            onClick={() => openSection('performance')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Student Performance
          </button>
          <button 
            onClick={() => openSection('attendance')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <ClipboardCheck className="w-4 h-4" />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div 
          onClick={() => openSection('classes')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8" />
            <span className="text-2xl font-bold">{facultyStats.assignedClasses}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Assigned Classes</h3>
          <p className="text-xs opacity-75 mt-1">{facultyStats.totalStudents} total students</p>
        </div>

        <div 
          onClick={() => openSection('exams')}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <span className="text-2xl font-bold">{facultyStats.upcomingExams}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Upcoming Exams</h3>
          <p className="text-xs opacity-75 mt-1">Within next 2 weeks</p>
        </div>

        <div 
          onClick={() => openSection('grading')}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <ClipboardCheck className="w-8 h-8" />
            <span className="text-2xl font-bold">{facultyStats.pendingGrading}</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Pending Grading</h3>
          <p className="text-xs opacity-75 mt-1">Requires attention</p>
        </div>

        <div 
          onClick={() => openSection('performance')}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-2xl font-bold">{Math.round((facultyStats.totalStudents * 0.78))}%</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Avg Performance</h3>
          <p className="text-xs opacity-75 mt-1">Across all classes</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Attendance Today</p>
              <p className="text-2xl font-bold text-gray-800">{facultyStats.attendanceToday}/{facultyStats.assignedClasses}</p>
              <p className="text-xs text-gray-500 mt-1">Classes marked</p>
            </div>
            <ClipboardCheck className="w-10 h-10 text-indigo-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Syllabus Uploaded</p>
              <p className="text-2xl font-bold text-gray-800">{facultyStats.syllabusUploaded}/{facultyStats.assignedClasses}</p>
              <p className="text-xs text-gray-500 mt-1">Classes completed</p>
            </div>
            <FileText className="w-10 h-10 text-cyan-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Marks Uploaded</p>
              <p className="text-2xl font-bold text-gray-800">{facultyStats.marksUploaded}</p>
              <p className="text-xs text-gray-500 mt-1">Assessments graded</p>
            </div>
            <FileSpreadsheet className="w-10 h-10 text-amber-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Attendance Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Weekly Attendance Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#10b981" name="Present" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Student Performance Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            Performance Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={studentPerformanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, count }) => `${range}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {studentPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Class Schedule & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Today's Classes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Today's Classes
            </h3>
          </div>
          <div className="space-y-3">
            {assignedClasses.slice(0, 3).map((cls) => (
              <div key={cls.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{cls.name}</h4>
                    <p className="text-sm text-gray-600">{cls.code} - {cls.program}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    cls.attendanceMarked 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {cls.attendanceMarked ? 'Marked' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {cls.schedule.split('-')[0]}
                  </span>
                  {!cls.attendanceMarked && (
                    <button
                      onClick={() => handleMarkAttendance(cls.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition-colors"
                    >
                      Mark Attendance
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Grading Tasks */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <ClipboardCheck className="w-5 h-5 mr-2 text-orange-600" />
              Pending Grading
            </h3>
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-semibold">
              {pendingGradingTasks.length} tasks
            </span>
          </div>
          <div className="space-y-3">
            {pendingGradingTasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{task.type}</h4>
                    <p className="text-sm text-gray-600">{task.subject}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    {task.submitted}/{task.students} submitted
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedGradingTask(task);
                      setShowGradingModal(true);
                    }}
                    className="text-blue-600 hover:underline text-xs font-medium"
                  >
                    Start Grading
                  </button>
                </div>
              </div>
            ))}
          </div>
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
                  {activity.type === 'attendance' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {activity.type === 'upload' && <Upload className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'grading' && <ClipboardCheck className="w-5 h-5 text-orange-600" />}
                  {activity.type === 'exam' && <FileText className="w-5 h-5 text-purple-600" />}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.class}</p>
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
            Notifications
          </h3>
          <div className="space-y-3">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Exam in 2 weeks</p>
                  <p className="text-xs text-gray-600">Data Structures - Upload questions by Oct 10</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Grading Overdue</p>
                  <p className="text-xs text-gray-600">Assignment 3 - Due date passed</p>
                  <button className="text-xs text-red-600 hover:underline mt-1 font-medium">
                    Grade Now →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Syllabus Pending</p>
                  <p className="text-xs text-gray-600">Computer Networks - Upload syllabus</p>
                  <button 
                    onClick={() => {
                      setUploadType('syllabus');
                      setShowUploadModal(true);
                    }}
                    className="text-xs text-blue-600 hover:underline mt-1 font-medium"
                  >
                    Upload Now →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modals */}
      {/* Classes Modal */}
      <DetailModal
        isOpen={activeModal === 'classes'}
        onClose={closeModal}
        title="My Classes"
        subtitle={`${assignedClasses.length} classes assigned`}
        showFilter
        showSearch
      >
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Total Classes</p>
              <h3 className="text-xl font-bold text-blue-600">{assignedClasses.length}</h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Total Students</p>
              <h3 className="text-xl font-bold text-green-600">{facultyStats.totalStudents}</h3>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm text-gray-600">Syllabus Uploaded</p>
              <h3 className="text-xl font-bold text-purple-600">{facultyStats.syllabusUploaded}/{assignedClasses.length}</h3>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <p className="text-sm text-gray-600">Attendance Marked</p>
              <h3 className="text-xl font-bold text-orange-600">{facultyStats.attendanceToday}/{assignedClasses.length}</h3>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Class Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Students</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Schedule</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Syllabus</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignedClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{cls.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cls.code}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600">{cls.students}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cls.schedule}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      cls.syllabusUploaded ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {cls.syllabusUploaded ? 'Uploaded' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedClassForAttendance(cls);
                          setShowAttendanceDetailModal(true);
                        }}
                        className="text-blue-600 hover:underline font-medium text-xs"
                      >
                        Mark Attendance
                      </button>
                      {cls.syllabusUploaded ? (
                        <>
                          <button 
                            onClick={() => {
                              alert(`📄 Viewing Syllabus\n\nClass: ${cls.name}\nCode: ${cls.code}\n\nThis would open the uploaded syllabus document.`);
                            }}
                            className="text-green-600 hover:underline font-medium text-xs"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => {
                              addNotification({
                                id: `notif-${Date.now()}`,
                                type: 'success',
                                message: `Downloading syllabus for ${cls.name}`,
                                timestamp: new Date().toISOString(),
                                read: false
                              });
                              alert(`📥 Downloading Syllabus\n\nClass: ${cls.name}\nFile: ${cls.code}_Syllabus.pdf\n\nDownload started...`);
                            }}
                            className="text-purple-600 hover:underline font-medium text-xs"
                          >
                            Download
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => {
                            setUploadType('syllabus');
                            setShowUploadModal(true);
                          }}
                          className="text-orange-600 hover:underline font-medium text-xs"
                        >
                          Upload Syllabus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailModal>

      {/* Exams Modal */}
      <DetailModal
        isOpen={activeModal === 'exams'}
        onClose={closeModal}
        title="Upcoming Exams"
        subtitle={`${upcomingExams.length} exams scheduled`}
        showFilter
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm text-gray-600">Total Exams</p>
              <h3 className="text-xl font-bold text-purple-600">{upcomingExams.length}</h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Questions Uploaded</p>
              <h3 className="text-xl font-bold text-green-600">
                {upcomingExams.filter(e => e.questionsUploaded).length}
              </h3>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <p className="text-sm text-gray-600">Marks Pending</p>
              <h3 className="text-xl font-bold text-orange-600">
                {upcomingExams.filter(e => !e.marksUploaded).length}
              </h3>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Room</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Students</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Questions</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {upcomingExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    <div>{exam.subject}</div>
                    <div className="text-xs text-gray-500">{exam.code}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div>{new Date(exam.date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{exam.time}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{exam.room}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600">{exam.students}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      exam.questionsUploaded ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {exam.questionsUploaded ? 'Uploaded' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-col gap-1">
                      {exam.questionsUploaded ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              alert(`📄 Viewing Question Paper\n\nExam: ${exam.subject}\nDate: ${new Date(exam.date).toLocaleDateString()}\n\nThis would open the uploaded question paper.`);
                            }}
                            className="text-blue-600 hover:underline font-medium text-xs"
                          >
                            View Questions
                          </button>
                          <button 
                            onClick={() => {
                              addNotification({
                                id: `notif-${Date.now()}`,
                                type: 'success',
                                message: `Downloading questions for ${exam.subject}`,
                                timestamp: new Date().toISOString(),
                                read: false
                              });
                              alert(`📥 Downloading Questions\n\nExam: ${exam.subject}\nFile: ${exam.code}_Questions.pdf\n\nDownload started...`);
                            }}
                            className="text-purple-600 hover:underline font-medium text-xs"
                          >
                            Download
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setUploadType('questions');
                            setShowUploadModal(true);
                          }}
                          className="text-orange-600 hover:underline font-medium text-xs"
                        >
                          Upload Questions
                        </button>
                      )}
                      {exam.marksUploaded ? (
                        <button 
                          onClick={() => {
                            alert(`📊 Viewing Marks\n\nExam: ${exam.subject}\nStudents: ${exam.students}\n\nThis would show the marks sheet with all student grades.`);
                          }}
                          className="text-green-600 hover:underline font-medium text-xs"
                        >
                          View Marks
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            setUploadType('marks');
                            setShowUploadModal(true);
                          }}
                          className="text-green-600 hover:underline font-medium text-xs"
                        >
                          Upload Marks
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailModal>

      {/* Grading Modal */}
      <DetailModal
        isOpen={activeModal === 'grading'}
        onClose={closeModal}
        title="Pending Grading Tasks"
        subtitle={`${pendingGradingTasks.length} tasks pending`}
      >
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              You have <span className="font-bold text-orange-600">{pendingGradingTasks.length}</span> grading tasks that need your attention.
            </p>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Assessment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Submissions</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingGradingTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{task.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.subject}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                    {task.submitted}/{task.students}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button 
                      onClick={() => {
                        setSelectedGradingTask(task);
                        setShowGradingModal(true);
                      }}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Start Grading
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailModal>

      {/* Performance Modal */}
      <DetailModal
        isOpen={activeModal === 'performance'}
        onClose={closeModal}
        title="Student Performance"
        subtitle="Overall performance across all classes"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Performance Summary</h3>
            <button 
              onClick={handleExportPerformance}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {studentPerformanceData.map((range) => (
              <div key={range.range} className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderColor: range.color }}>
                <p className="text-sm text-gray-600">{range.range}%</p>
                <h3 className="text-2xl font-bold text-gray-800">{range.count}</h3>
                <p className="text-xs text-gray-500 mt-1">students</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Performance Insights:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Average performance: <strong>78%</strong></li>
              <li>• Top performer: <strong>95%</strong> - Excellent work!</li>
              <li>• {studentPerformanceData[studentPerformanceData.length - 1].count} students need attention (below 60%)</li>
              <li>• Attendance correlation: <strong>Strong</strong> - Higher attendance = Better grades</li>
            </ul>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={studentPerformanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, count, percent }) => `${range}: ${count} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {studentPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </DetailModal>

      {/* Attendance Modal */}
      <DetailModal
        isOpen={activeModal === 'attendance'}
        onClose={closeModal}
        title="Mark Attendance"
        subtitle="Today's classes attendance"
      >
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-bold text-indigo-600">{assignedClasses.length}</span> classes scheduled. Mark attendance for each class.
            </p>
          </div>

          <div className="space-y-3">
            {assignedClasses.map((cls) => (
              <div key={cls.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{cls.name}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {cls.code}
                      </span>
                      <span className="text-sm text-gray-600">• {cls.students} students</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{cls.schedule}</span>
                      </div>
                      <div>
                        <span>{cls.program} - {cls.semester} Sem</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      {cls.attendanceMarked ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Attendance marked today
                        </span>
                      ) : (
                        <span className="text-xs text-orange-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Attendance pending (Last: {cls.lastAttendance})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedClassForAttendance(cls);
                        setShowAttendanceDetailModal(true);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      Mark Attendance
                    </button>
                    <button
                      onClick={() => {
                        alert(`Viewing attendance history for ${cls.name} (${cls.code})\n\nShowing:\n• Last attendance: ${cls.lastAttendance}\n• Average attendance: ${Math.floor(Math.random() * 15) + 75}%\n• Total classes: ${Math.floor(Math.random() * 10) + 20}\n• Students: ${cls.students}`);
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      View History
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-gray-800 mb-3">Quick Stats</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{assignedClasses.filter(c => c.attendanceMarked).length}</p>
                <p className="text-xs text-gray-600">Marked Today</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{assignedClasses.filter(c => !c.attendanceMarked).length}</p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{assignedClasses.length}</p>
                <p className="text-xs text-gray-600">Total Classes</p>
              </div>
            </div>
          </div>
        </div>
      </DetailModal>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Upload {uploadType}</h3>
                    <p className="text-sm text-gray-600">Select file to upload</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setUploadProgress(0);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xlsx,.csv"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="faculty-upload-file"
                />
                <label htmlFor="faculty-upload-file" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  {selectedFile ? (
                    <div>
                      <p className="text-sm font-semibold text-green-600">✓ {selectedFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Click to select file</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, DOC, XLSX, CSV</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Progress Bar */}
              {uploadProgress > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                    <span className="text-sm font-semibold text-blue-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setUploadProgress(0);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadFile}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={!selectedFile}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Grading Modal */}
      {showGradingModal && selectedGradingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h3 className="text-2xl font-bold">{selectedGradingTask.type}</h3>
                  <p className="text-orange-100 mt-1">{selectedGradingTask.subject} • Max Marks: {selectedGradingTask.maxMarks}</p>
                  <p className="text-sm text-orange-100 mt-1">Due: {new Date(selectedGradingTask.dueDate).toLocaleDateString()} • {selectedGradingTask.submitted}/{selectedGradingTask.students} submissions</p>
                </div>
                <button
                  onClick={() => {
                    setShowGradingModal(false);
                    setSelectedGradingTask(null);
                    setStudentGrades({});
                  }}
                  className="text-white hover:bg-orange-700 rounded-lg p-2 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            {/* Grading Interface */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 grid grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="text-sm text-gray-600">Submitted</p>
                  <h3 className="text-2xl font-bold text-green-600">{selectedGradingTask.submitted}</h3>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <p className="text-sm text-gray-600">Pending</p>
                  <h3 className="text-2xl font-bold text-orange-600">{selectedGradingTask.students - selectedGradingTask.submitted}</h3>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600">Graded</p>
                  <h3 className="text-2xl font-bold text-blue-600">{Object.keys(studentGrades).length}</h3>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <p className="text-sm text-gray-600">Max Marks</p>
                  <h3 className="text-2xl font-bold text-purple-600">{selectedGradingTask.maxMarks}</h3>
                </div>
              </div>

              {/* Student List with Grading */}
              <div className="space-y-3">
                {generateStudentsForTask(selectedGradingTask.id, selectedGradingTask.submitted).map((student) => (
                  <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors bg-white">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-800">{student.name}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            {student.rollNo}
                          </span>
                          <span className="text-xs text-gray-500">
                            Submitted: {student.submittedDate}
                          </span>
                          {studentGrades[student.id] && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                              ✓ Graded
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Marks (out of {selectedGradingTask.maxMarks})
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={selectedGradingTask.maxMarks}
                              value={studentGrades[student.id]?.marks || ''}
                              onChange={(e) => {
                                setStudentGrades({
                                  ...studentGrades,
                                  [student.id]: {
                                    ...studentGrades[student.id],
                                    marks: e.target.value
                                  }
                                });
                              }}
                              placeholder="Enter marks"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Comments/Feedback
                            </label>
                            <input
                              type="text"
                              value={studentGrades[student.id]?.comments || ''}
                              onChange={(e) => {
                                setStudentGrades({
                                  ...studentGrades,
                                  [student.id]: {
                                    ...studentGrades[student.id],
                                    comments: e.target.value
                                  }
                                });
                              }}
                              placeholder="Optional feedback"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => {
                              alert(`Viewing submission for ${student.name}\n\nThis would open the student's submitted work.`);
                            }}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            View Submission
                          </button>
                          <button
                            onClick={() => {
                              alert(`Downloading ${student.name}'s submission...`);
                            }}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Progress: <span className="font-semibold text-gray-800">{Object.keys(studentGrades).length}/{selectedGradingTask.submitted}</span> graded
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowGradingModal(false);
                    setSelectedGradingTask(null);
                    setStudentGrades({});
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (Object.keys(studentGrades).length === 0) {
                      alert('Please grade at least one student before saving.');
                      return;
                    }
                    addNotification({
                      id: `notif-${Date.now()}`,
                      type: 'success',
                      message: `Grades saved for ${Object.keys(studentGrades).length} students in ${selectedGradingTask.type}`,
                      timestamp: new Date().toISOString(),
                      read: false
                    });
                    alert(`✅ Grades Saved Successfully!\n\nGraded: ${Object.keys(studentGrades).length} students\nTask: ${selectedGradingTask.type}\nSubject: ${selectedGradingTask.subject}\n\nStudents will be notified of their grades.`);
                    setShowGradingModal(false);
                    setSelectedGradingTask(null);
                    setStudentGrades({});
                  }}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Save All Grades
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Attendance Modal */}
      {showAttendanceDetailModal && selectedClassForAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-indigo-600">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h3 className="text-2xl font-bold">{selectedClassForAttendance.name}</h3>
                  <p className="text-indigo-100 mt-1">{selectedClassForAttendance.code} • {selectedClassForAttendance.program} - {selectedClassForAttendance.semester} Sem</p>
                  <p className="text-sm text-indigo-100 mt-1">{selectedClassForAttendance.schedule} • {selectedClassForAttendance.students} Students</p>
                </div>
                <button
                  onClick={() => {
                    setShowAttendanceDetailModal(false);
                    setSelectedClassForAttendance(null);
                    setAttendanceRecords({});
                  }}
                  className="text-white hover:bg-indigo-700 rounded-lg p-2 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  const newRecords: Record<string, boolean> = {};
                  for (let i = 1; i <= selectedClassForAttendance.students; i++) {
                    newRecords[`STU-${i}`] = true;
                  }
                  setAttendanceRecords(newRecords);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Mark All Present
              </button>
              <button
                onClick={() => {
                  const newRecords: Record<string, boolean> = {};
                  for (let i = 1; i <= selectedClassForAttendance.students; i++) {
                    newRecords[`STU-${i}`] = false;
                  }
                  setAttendanceRecords(newRecords);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Mark All Absent
              </button>
              <button
                onClick={() => {
                  setAttendanceRecords({});
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                  <p className="text-xs text-gray-600">Present</p>
                  <h3 className="text-xl font-bold text-green-600">
                    {Object.values(attendanceRecords).filter(v => v === true).length}
                  </h3>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
                  <p className="text-xs text-gray-600">Absent</p>
                  <h3 className="text-xl font-bold text-red-600">
                    {Object.values(attendanceRecords).filter(v => v === false).length}
                  </h3>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-500">
                  <p className="text-xs text-gray-600">Not Marked</p>
                  <h3 className="text-xl font-bold text-gray-600">
                    {selectedClassForAttendance.students - Object.keys(attendanceRecords).length}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.from({ length: selectedClassForAttendance.students }, (_, i) => {
                  const studentId = `STU-${i + 1}`;
                  const rollNo = `2023CSE${String(i + 1).padStart(3, '0')}`;
                  const studentName = `Student ${i + 1}`;
                  const isPresent = attendanceRecords[studentId];
                  
                  return (
                    <div key={studentId} className={`border rounded-lg p-3 transition-all ${
                      isPresent === true ? 'border-green-500 bg-green-50' : 
                      isPresent === false ? 'border-red-500 bg-red-50' : 
                      'border-gray-200 bg-white'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">{studentName}</h4>
                          <p className="text-xs text-gray-600">{rollNo}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setAttendanceRecords({
                                ...attendanceRecords,
                                [studentId]: true
                              });
                            }}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                              isPresent === true 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => {
                              setAttendanceRecords({
                                ...attendanceRecords,
                                [studentId]: false
                              });
                            }}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                              isPresent === false 
                                ? 'bg-red-600 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Marked: <span className="font-semibold text-gray-800">{Object.keys(attendanceRecords).length}/{selectedClassForAttendance.students}</span> students
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAttendanceDetailModal(false);
                    setSelectedClassForAttendance(null);
                    setAttendanceRecords({});
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAttendance}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Save Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
