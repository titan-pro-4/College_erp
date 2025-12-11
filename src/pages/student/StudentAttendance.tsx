import { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

export default function StudentAttendance() {
  const [selectedMonth, setSelectedMonth] = useState('October 2025');

  // Mock attendance data
  const attendanceStats = {
    overallPercentage: 87.5,
    totalClasses: 120,
    attended: 105,
    absent: 15,
    currentStreak: 12,
    requiredPercentage: 75,
  };

  const subjectWiseAttendance = [
    { subject: 'Data Structures', code: 'CS301', total: 24, attended: 22, percentage: 91.7, status: 'Good' },
    { subject: 'Database Management', code: 'CS302', total: 24, attended: 20, percentage: 83.3, status: 'Average' },
    { subject: 'Operating Systems', code: 'CS303', total: 24, attended: 23, percentage: 95.8, status: 'Excellent' },
    { subject: 'Computer Networks', code: 'CS304', total: 24, attended: 21, percentage: 87.5, status: 'Good' },
    { subject: 'Software Engineering', code: 'CS305', total: 24, attended: 19, percentage: 79.2, status: 'Warning' },
  ];

  const monthlyCalendar = [
    { date: '2025-10-01', day: 'Mon', status: 'present' },
    { date: '2025-10-02', day: 'Tue', status: 'present' },
    { date: '2025-10-03', day: 'Wed', status: 'absent' },
    { date: '2025-10-04', day: 'Thu', status: 'present' },
    { date: '2025-10-05', day: 'Fri', status: 'present' },
    { date: '2025-10-06', day: 'Sat', status: 'holiday' },
    { date: '2025-10-07', day: 'Sun', status: 'holiday' },
    { date: '2025-10-08', day: 'Mon', status: 'present' },
    { date: '2025-10-09', day: 'Tue', status: 'present' },
    { date: '2025-10-10', day: 'Wed', status: 'present' },
    // Add more dates as needed
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'absent':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'holiday':
        return 'bg-gray-100 border-gray-300 text-gray-500';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getSubjectStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 75) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Attendance</h1>
        <p className="text-gray-600 mt-1">Track your class attendance and maintain consistency</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Overall Attendance</h3>
            {attendanceStats.overallPercentage >= attendanceStats.requiredPercentage ? (
              <TrendingUp className="text-green-600" size={20} />
            ) : (
              <TrendingDown className="text-red-600" size={20} />
            )}
          </div>
          <p className="text-3xl font-bold text-blue-600">{attendanceStats.overallPercentage}%</p>
          <p className="text-sm text-gray-500 mt-1">
            {attendanceStats.attended} / {attendanceStats.totalClasses} classes
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Classes Attended</h3>
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-green-600">{attendanceStats.attended}</p>
          <p className="text-sm text-gray-500 mt-1">Present</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Classes Missed</h3>
            <XCircle className="text-red-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-red-600">{attendanceStats.absent}</p>
          <p className="text-sm text-gray-500 mt-1">Absent</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Current Streak</h3>
            <Clock className="text-orange-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-orange-600">{attendanceStats.currentStreak}</p>
          <p className="text-sm text-gray-500 mt-1">Days consecutive</p>
        </div>
      </div>

      {/* Warning Banner */}
      {attendanceStats.overallPercentage < attendanceStats.requiredPercentage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-red-600 mt-1 mr-3" size={20} />
            <div>
              <h3 className="text-red-800 font-semibold">Low Attendance Warning</h3>
              <p className="text-red-700 text-sm mt-1">
                Your attendance is below the required {attendanceStats.requiredPercentage}%. You need to attend at least{' '}
                {Math.ceil((attendanceStats.requiredPercentage * attendanceStats.totalClasses) / 100 - attendanceStats.attended)}{' '}
                more classes to meet the requirement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subject-wise Attendance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Subject-wise Attendance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Attended</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Total</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Percentage</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjectWiseAttendance.map((subject, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{subject.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{subject.code}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-800">{subject.attended}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{subject.total}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSubjectStatusColor(subject.percentage)}`}>
                      {subject.percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        subject.status === 'Excellent'
                          ? 'bg-green-100 text-green-700'
                          : subject.status === 'Good'
                          ? 'bg-blue-100 text-blue-700'
                          : subject.status === 'Average'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {subject.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Calendar View */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Monthly Calendar</h2>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>October 2025</option>
            <option>September 2025</option>
            <option>August 2025</option>
          </select>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
          {monthlyCalendar.map((day, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg p-3 text-center transition-colors ${getStatusColor(day.status)}`}
            >
              <div className="text-xs font-medium">{day.day}</div>
              <div className="text-lg font-bold">{new Date(day.date).getDate()}</div>
              {day.status === 'present' && <CheckCircle size={16} className="mx-auto mt-1" />}
              {day.status === 'absent' && <XCircle size={16} className="mx-auto mt-1" />}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
            <span className="text-gray-600">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
            <span className="text-gray-600">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
            <span className="text-gray-600">Holiday</span>
          </div>
        </div>
      </div>
    </div>
  );
}
