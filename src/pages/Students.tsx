import { useApp } from '../contexts/AppContext';
import { Search, Download } from 'lucide-react';

export default function Students() {
  const { students } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Students Directory</h1>
          <p className="text-gray-600 mt-1">View and manage all student records</p>
        </div>
        <button className="btn btn-primary flex items-center space-x-2">
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <div className="text-sm text-gray-600">Total Students</div>
          <div className="text-2xl font-bold mt-1">{students.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold mt-1 text-green-600">
            {students.filter((s) => s.status === 'Active').length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">With Hostel</div>
          <div className="text-2xl font-bold mt-1 text-blue-600">
            {students.filter((s) => s.hostel).length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Pending Dues</div>
          <div className="text-2xl font-bold mt-1 text-red-600">
            {students.filter((s) => s.feeBalance > 0).length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">All Students</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Course</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Hostel</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Balance</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.studentId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm">{student.studentId}</td>
                  <td className="py-3 px-4 font-medium">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="py-3 px-4 text-sm">{student.course}</td>
                  <td className="py-3 px-4 text-sm">{student.phone}</td>
                  <td className="py-3 px-4 text-sm">{student.email}</td>
                  <td className="py-3 px-4 text-sm">
                    {student.hostel ? `${student.hostel.building}-${student.hostel.room}` : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={student.feeBalance > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                      ₹{student.feeBalance.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="text-primary hover:underline text-sm"
                      title="View profile"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
