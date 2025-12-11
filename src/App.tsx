import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import Layout from './components/Layout'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import PublicAdmission from './pages/PublicAdmission'
import Dashboard from './pages/Dashboard'
import StudentDashboard from './pages/StudentDashboard'
import ClerkDashboard from './pages/ClerkDashboard'
import AdminDashboard from './pages/AdminDashboard'
import FacultyDashboard from './pages/FacultyDashboard'
import HostelDashboard from './pages/HostelDashboard'
import Admissions from './pages/Admissions'
import Fees from './pages/Fees'
import Hostel from './pages/Hostel'
import Exams from './pages/Exams'
import Students from './pages/Students'
import Settings from './pages/Settings'
// Student-specific pages
import StudentProfile from './pages/student/StudentProfile'
import StudentAttendance from './pages/student/StudentAttendance'
import StudentResults from './pages/student/StudentResults'
import StudentLibrary from './pages/student/StudentLibrary'
import StudentFees from './pages/student/StudentFees'
import StudentAdmitCard from './pages/student/StudentAdmitCard'
import StudentFeedback from './pages/student/StudentFeedback'
import './App.css'

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes (No Layout) */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/public-admission" element={<PublicAdmission />} />

          {/* Protected Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/clerk-dashboard" element={<ClerkDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
            <Route path="/hostel-dashboard" element={<HostelDashboard />} />
            
            {/* Student-specific routes */}
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/attendance" element={<StudentAttendance />} />
            <Route path="/student/results" element={<StudentResults />} />
            <Route path="/student/library" element={<StudentLibrary />} />
            <Route path="/student/fees" element={<StudentFees />} />
            <Route path="/student/admit-card" element={<StudentAdmitCard />} />
            <Route path="/student/feedback" element={<StudentFeedback />} />
            
            {/* Admin/Clerk routes */}
            <Route path="/students" element={<Students />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/hostel" element={<Hostel />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
