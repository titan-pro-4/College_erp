import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { UserPlus, Upload, Search, X, FileText, CheckCircle, AlertCircle, Check, XCircle } from 'lucide-react';
import { Student } from '../types';
import { admissionService } from '../services/admissionService';

interface PendingAdmission {
  id: string;
  student_name: string;
  email: string;
  phone: string;
  course: string;
  gender: string;
  date_of_birth: string;
  address: string;
  guardian_name: string;
  guardian_phone: string;
  status: string;
  applied_date: string;
  notes?: string;
}

export default function Admissions() {
  const { students, addStudent } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [pendingAdmissions, setPendingAdmissions] = useState<PendingAdmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportData, setBulkImportData] = useState<any[]>([]);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    aadhaar: '',
    email: '',
    phone: '',
    course: '',
  });

  // Load pending admissions from database
  useEffect(() => {
    loadPendingAdmissions();
  }, []);

  const loadPendingAdmissions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await admissionService.getPending();
      setPendingAdmissions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load admissions');
      console.error('Error loading admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, name: string) => {
    if (!confirm(`Approve admission for ${name}?`)) return;
    
    try {
      await admissionService.approve(id, 'clerk-user-id');
      await loadPendingAdmissions(); // Refresh list
      alert('Admission approved successfully!');
    } catch (err: any) {
      alert('Failed to approve: ' + err.message);
    }
  };

  const handleReject = async (id: string, name: string) => {
    const reason = prompt(`Reject admission for ${name}?\nEnter rejection reason:`);
    if (!reason) return;
    
    try {
      await admissionService.reject(id, 'clerk-user-id', reason);
      await loadPendingAdmissions(); // Refresh list
      alert('Admission rejected.');
    } catch (err: any) {
      alert('Failed to reject: ' + err.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newStudent: Student = {
      studentId: `COL2025-${String(students.length + 1).padStart(4, '0')}`,
      ...formData,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      feeBalance: 0,
      documents: [],
      audit: [
        {
          by: 'clerk1',
          ts: new Date().toISOString(),
          action: 'created',
        },
      ],
    };

    addStudent(newStudent);
    setShowForm(false);
    setFormData({
      firstName: '',
      lastName: '',
      dob: '',
      aadhaar: '',
      email: '',
      phone: '',
      course: '',
    });
  };

  // Bulk Import Functions
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setImportStatus('error');
          setImportMessage('CSV file must contain headers and at least one student');
          return;
        }

        // Parse CSV
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const requiredHeaders = ['firstname', 'lastname', 'dob', 'aadhaar', 'email', 'phone', 'course'];
        
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          setImportStatus('error');
          setImportMessage(`Missing required columns: ${missingHeaders.join(', ')}`);
          return;
        }

        const data = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim());
          const row: any = {};
          headers.forEach((header, i) => {
            row[header] = values[i] || '';
          });
          row._rowNumber = index + 2; // +2 because of header and 0-index
          return row;
        });

        setBulkImportData(data);
        setImportStatus('idle');
        setImportMessage(`Loaded ${data.length} students. Review and click Import to continue.`);
      } catch (error) {
        setImportStatus('error');
        setImportMessage('Error parsing CSV file. Please check the format.');
      }
    };

    reader.readAsText(file);
  };

  const handleBulkImport = () => {
    if (bulkImportData.length === 0) return;

    setImportStatus('processing');
    let successCount = 0;
    let errorCount = 0;

    bulkImportData.forEach((row) => {
      try {
        const newStudent: Student = {
          studentId: `COL2025-${String(students.length + successCount + 1).padStart(4, '0')}`,
          firstName: row.firstname || '',
          lastName: row.lastname || '',
          dob: row.dob || '',
          aadhaar: row.aadhaar || '',
          email: row.email || '',
          phone: row.phone || '',
          course: row.course || '',
          admissionDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          feeBalance: parseInt(row.feebalance) || 0,
          documents: [],
          audit: [
            {
              by: 'clerk1',
              ts: new Date().toISOString(),
              action: 'bulk-imported',
            },
          ],
        };

        addStudent(newStudent);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    });

    setImportStatus('success');
    setImportMessage(`Successfully imported ${successCount} students. ${errorCount > 0 ? `${errorCount} failed.` : ''}`);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setShowBulkImport(false);
      setBulkImportData([]);
      setImportStatus('idle');
      setImportMessage('');
    }, 3000);
  };

  const downloadTemplate = () => {
    const template = 'firstName,lastName,dob,aadhaar,email,phone,course,feeBalance\nJohn,Doe,2000-01-15,123456789012,john@example.com,+91-9876543210,BSc Computer Science,0\nJane,Smith,2001-03-20,234567890123,jane@example.com,+91-9876543211,BA English Literature,0';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admissions</h1>
          <p className="text-gray-600 mt-1">Manage student admissions and intake</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowBulkImport(true)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Upload size={18} />
            <span>Bulk Import</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <UserPlus size={18} />
            <span>New Admission</span>
          </button>
        </div>
      </div>

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-card max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Bulk Import Students</h2>
              <button
                onClick={() => {
                  setShowBulkImport(false);
                  setBulkImportData([]);
                  setImportStatus('idle');
                  setImportMessage('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Download the CSV template below</li>
                <li>2. Fill in student details (one student per row)</li>
                <li>3. Upload the completed CSV file</li>
                <li>4. Review the data and click Import</li>
              </ul>
              <button
                onClick={downloadTemplate}
                className="mt-3 text-sm text-primary hover:underline flex items-center space-x-1"
              >
                <FileText size={16} />
                <span>Download CSV Template</span>
              </button>
            </div>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm text-gray-600 mb-3">
                Upload CSV file with student data
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="bulk-upload"
              />
              <label
                htmlFor="bulk-upload"
                className="btn btn-secondary cursor-pointer inline-block"
              >
                Choose CSV File
              </label>
            </div>

            {/* Status Message */}
            {importMessage && (
              <div className={`p-4 rounded-lg mb-4 flex items-start space-x-3 ${
                importStatus === 'error' ? 'bg-red-50 border border-red-200' :
                importStatus === 'success' ? 'bg-green-50 border border-green-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                {importStatus === 'error' && <AlertCircle className="text-red-600 mt-0.5" size={20} />}
                {importStatus === 'success' && <CheckCircle className="text-green-600 mt-0.5" size={20} />}
                {importStatus === 'idle' && <FileText className="text-blue-600 mt-0.5" size={20} />}
                <p className={`text-sm ${
                  importStatus === 'error' ? 'text-red-800' :
                  importStatus === 'success' ? 'text-green-800' :
                  'text-blue-800'
                }`}>
                  {importMessage}
                </p>
              </div>
            )}

            {/* Preview Table */}
            {bulkImportData.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Preview ({bulkImportData.length} students)</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left py-2 px-3 font-semibold">#</th>
                        <th className="text-left py-2 px-3 font-semibold">Name</th>
                        <th className="text-left py-2 px-3 font-semibold">DOB</th>
                        <th className="text-left py-2 px-3 font-semibold">Email</th>
                        <th className="text-left py-2 px-3 font-semibold">Course</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkImportData.map((row, index) => (
                        <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3">{index + 1}</td>
                          <td className="py-2 px-3">{row.firstname} {row.lastname}</td>
                          <td className="py-2 px-3">{row.dob}</td>
                          <td className="py-2 px-3 text-xs">{row.email}</td>
                          <td className="py-2 px-3 text-xs">{row.course}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowBulkImport(false);
                  setBulkImportData([]);
                  setImportStatus('idle');
                  setImportMessage('');
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              {bulkImportData.length > 0 && (
                <button
                  onClick={handleBulkImport}
                  disabled={importStatus === 'processing'}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importStatus === 'processing' ? 'Importing...' : `Import ${bulkImportData.length} Students`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admission Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
            <h2 className="text-xl font-bold mb-4">New Student Admission</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="input"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="label">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Aadhaar Number *</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{12}"
                    value={formData.aadhaar}
                    onChange={(e) =>
                      setFormData({ ...formData, aadhaar: e.target.value })
                    }
                    className="input"
                    placeholder="XXXX-XXXX-XXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Phone *</label>
                  <input
                    type="tel"
                    required
                    pattern="[+][0-9]{2}-[0-9]{10}"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="input"
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="label">Course *</label>
                <select
                  required
                  value={formData.course}
                  onChange={(e) =>
                    setFormData({ ...formData, course: e.target.value })
                  }
                  className="input"
                >
                  <option value="">Select a course</option>
                  <option value="BSc Computer Science">BSc Computer Science</option>
                  <option value="BA English Literature">BA English Literature</option>
                  <option value="BCom Accounting">BCom Accounting</option>
                  <option value="BTech Engineering">BTech Engineering</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Admit Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pending Admissions - Need Approval */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Pending Admissions</h3>
            <p className="text-sm text-gray-600 mt-1">Applications waiting for approval</p>
          </div>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold text-sm">
            {pendingAdmissions.length} Pending
          </span>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading pending admissions...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button onClick={loadPendingAdmissions} className="btn btn-secondary mt-2">
              Retry
            </button>
          </div>
        ) : pendingAdmissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending admissions. All applications have been processed!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Student Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Course</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Applied Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAdmissions.map((admission) => (
                  <tr key={admission.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium">{admission.student_name}</td>
                    <td className="py-3 px-4 text-sm">{admission.email}</td>
                    <td className="py-3 px-4 text-sm">{admission.phone}</td>
                    <td className="py-3 px-4 text-sm">{admission.course}</td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(admission.applied_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(admission.id, admission.student_name)}
                          className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleReject(admission.id, admission.student_name)}
                          className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Students List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Admissions</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm">Student ID</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Course</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Admission Date</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Balance</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(-10).reverse().map((student) => (
                <tr key={student.studentId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm">{student.studentId}</td>
                  <td className="py-3 px-4">{student.firstName} {student.lastName}</td>
                  <td className="py-3 px-4 text-sm">{student.course}</td>
                  <td className="py-3 px-4 text-sm">{student.admissionDate}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">₹{student.feeBalance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
