import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { LogIn, User, Lock, GraduationCap, ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setCurrentUser } = useApp();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['student', 'clerk', 'admin'].includes(roleParam)) {
      setSelectedRole(roleParam as UserRole);
    }
  }, [searchParams]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Demo authentication (replace with real auth)
    const mockUsers: Record<UserRole, { username: string; password: string; name: string }> = {
      student: { username: 'student', password: 'student123', name: 'John Doe' },
      clerk: { username: 'clerk', password: 'clerk123', name: 'Admin Clerk' },
      admin: { username: 'admin', password: 'admin123', name: 'Super Admin' },
      'fee-collector': { username: 'fee', password: 'fee123', name: 'Fee Collector' },
      'hostel-warden': { username: 'hostel', password: 'hostel123', name: 'Hostel Manager' },
      'exam-officer': { username: 'exam', password: 'exam123', name: 'Exam Officer' },
      registrar: { username: 'registrar', password: 'registrar123', name: 'Registrar' },
      faculty: { username: 'faculty', password: 'faculty123', name: 'Dr. Sarah Johnson' },
    };

    const user = mockUsers[selectedRole];
    
    if (username === user.username && password === user.password) {
      // Set user in context
      setCurrentUser({
        id: `${selectedRole}-001`,
        name: user.name,
        role: selectedRole,
      });

      // Route based on role
      if (selectedRole === 'student') {
        navigate('/student-dashboard');
      } else if (selectedRole === 'clerk') {
        navigate('/clerk-dashboard');
      } else if (selectedRole === 'admin') {
        navigate('/admin-dashboard');
      } else if (selectedRole === 'faculty') {
        navigate('/faculty-dashboard');
      } else if (selectedRole === 'hostel-warden') {
        navigate('/hostel-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Invalid username or password');
    }
  };

  const roles = [
    { value: 'student' as UserRole, label: 'Student', description: 'Access your academic records and services' },
    { value: 'faculty' as UserRole, label: 'Faculty', description: 'Manage classes, exams, and student performance' },
    { value: 'clerk' as UserRole, label: 'Clerk/Staff', description: 'Process admissions, fees, and operations' },
    { value: 'hostel-warden' as UserRole, label: 'Hostel Manager', description: 'Manage hostel allocations and maintenance' },
    { value: 'admin' as UserRole, label: 'Administrator', description: 'Full system access and management' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-accent-success/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-primary hover:text-blue-600 mb-4"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-card shadow-lg p-8 animate-scale-in">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <GraduationCap className="text-white" size={32} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-neutral-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Sign in to access your dashboard
          </p>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="label">Select Your Role</label>
            <div className="space-y-2">
              {roles.map((role) => (
                <label
                  key={role.value}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRole === role.value
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="sr-only"
                  />
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-900">{role.label}</div>
                      <div className="text-sm text-gray-600">{role.description}</div>
                    </div>
                    {selectedRole === role.value && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="label">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
              <div className="font-semibold text-blue-900 mb-1">Demo Credentials:</div>
              <div className="text-blue-800 space-y-1">
                <div>Student: <code className="bg-blue-100 px-1 rounded">student / student123</code></div>
                <div>Faculty: <code className="bg-blue-100 px-1 rounded">faculty / faculty123</code></div>
                <div>Clerk: <code className="bg-blue-100 px-1 rounded">clerk / clerk123</code></div>
                <div>Hostel: <code className="bg-blue-100 px-1 rounded">hostel / hostel123</code></div>
                <div>Admin: <code className="bg-blue-100 px-1 rounded">admin / admin123</code></div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn btn-primary flex items-center justify-center space-x-2"
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New here?{' '}
              <Link to="/public-admission" className="text-primary hover:underline">
                Apply for Admission
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
