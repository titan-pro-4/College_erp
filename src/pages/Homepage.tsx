import { Link } from 'react-router-dom';
import { GraduationCap, LogIn, Users, BookOpen, Award, Home as HomeIcon } from 'lucide-react';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-accent-success/10">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">College ERP</h1>
                <p className="text-sm text-gray-600">Excellence in Education</p>
              </div>
            </div>

            {/* Login Button */}
            <Link
              to="/login"
              className="btn btn-primary flex items-center space-x-2"
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">
            Welcome to College ERP System
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Streamlined management for admissions, academics, and administration
          </p>

          {/* New Admission CTA */}
          <Link
            to="/public-admission"
            className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Users size={24} />
            <span>New Admission</span>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {/* Feature 1 */}
          <div className="card hover:shadow-lg transition-shadow text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-primary" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Student Management</h3>
            <p className="text-sm text-gray-600">
              Comprehensive student records and profile management
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card hover:shadow-lg transition-shadow text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-accent-success" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Academic Excellence</h3>
            <p className="text-sm text-gray-600">
              Exam management, marks tracking, and performance analytics
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card hover:shadow-lg transition-shadow text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HomeIcon className="text-purple-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Hostel Management</h3>
            <p className="text-sm text-gray-600">
              Room allocation, occupancy tracking, and facility management
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card hover:shadow-lg transition-shadow text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-accent-warning" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Reports & Analytics</h3>
            <p className="text-sm text-gray-600">
              Comprehensive reporting and data-driven insights
            </p>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-16 bg-white rounded-card shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-gray-600">System Access</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-success mb-2">100%</div>
              <div className="text-sm text-gray-600">Cloud-Based</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">Real-Time</div>
              <div className="text-sm text-gray-600">Data Updates</div>
            </div>
          </div>
        </div>

        {/* Login Options */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-neutral-900 mb-6">
            Access Your Dashboard
          </h3>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login?role=student"
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Users size={18} />
              <span>Student Login</span>
            </Link>
            <Link
              to="/login?role=clerk"
              className="btn btn-secondary flex items-center space-x-2"
            >
              <BookOpen size={18} />
              <span>Staff Login</span>
            </Link>
            <Link
              to="/login?role=admin"
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Award size={18} />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 College ERP System. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Powered by modern web technologies
          </p>
        </div>
      </footer>
    </div>
  );
}
