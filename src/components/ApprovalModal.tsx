import React, { useState } from 'react';
import { X, CheckCircle, XCircle, FileText, User, Mail, Phone, Book, Calendar, MapPin } from 'lucide-react';

interface ApplicationDetails {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  course: string;
  date: string;
  status: string;
  dob?: string;
  address?: string;
  guardianName?: string;
  guardianPhone?: string;
  previousSchool?: string;
  percentage?: number;
}

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationDetails | null;
  onApprove: (id: string, remarks?: string) => void;
  onReject: (id: string, reason: string) => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  application,
  onApprove,
  onReject,
}) => {
  const [remarks, setRemarks] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !application) return null;

  const handleApprove = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    onApprove(application.id, remarks);
    setIsProcessing(false);
    setRemarks('');
    onClose();
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    onReject(application.id, rejectReason);
    setIsProcessing(false);
    setRejectReason('');
    setShowRejectForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Review Application</h2>
                <p className="text-sm opacity-90 mt-1">{application.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
            {/* Application Status */}
            <div className="mb-6">
              <div className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold ${
                application.status === 'Approved' ? 'bg-green-100 text-green-700' :
                application.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                application.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                <FileText className="w-5 h-5 mr-2" />
                Status: {application.status}
              </div>
            </div>

            {/* Applicant Information */}
            <div className="space-y-6">
              {/* Personal Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <p className="font-semibold text-gray-800">{application.name}</p>
                  </div>
                  {application.dob && (
                    <div>
                      <label className="text-sm text-gray-600">Date of Birth</label>
                      <p className="font-semibold text-gray-800">{application.dob}</p>
                    </div>
                  )}
                  {application.email && (
                    <div>
                      <label className="text-sm text-gray-600 flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </label>
                      <p className="font-semibold text-gray-800">{application.email}</p>
                    </div>
                  )}
                  {application.phone && (
                    <div>
                      <label className="text-sm text-gray-600 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Phone
                      </label>
                      <p className="font-semibold text-gray-800">{application.phone}</p>
                    </div>
                  )}
                  {application.address && (
                    <div className="col-span-2">
                      <label className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        Address
                      </label>
                      <p className="font-semibold text-gray-800">{application.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Book className="w-5 h-5 mr-2 text-green-600" />
                  Academic Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Course Applied</label>
                    <p className="font-semibold text-gray-800">{application.course}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Application Date
                    </label>
                    <p className="font-semibold text-gray-800">{application.date}</p>
                  </div>
                  {application.previousSchool && (
                    <div>
                      <label className="text-sm text-gray-600">Previous School</label>
                      <p className="font-semibold text-gray-800">{application.previousSchool}</p>
                    </div>
                  )}
                  {application.percentage && (
                    <div>
                      <label className="text-sm text-gray-600">Previous Percentage</label>
                      <p className="font-semibold text-gray-800">{application.percentage}%</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Guardian Details */}
              {(application.guardianName || application.guardianPhone) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-purple-600" />
                    Guardian Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                    {application.guardianName && (
                      <div>
                        <label className="text-sm text-gray-600">Guardian Name</label>
                        <p className="font-semibold text-gray-800">{application.guardianName}</p>
                      </div>
                    )}
                    {application.guardianPhone && (
                      <div>
                        <label className="text-sm text-gray-600 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          Guardian Phone
                        </label>
                        <p className="font-semibold text-gray-800">{application.guardianPhone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Approval Section */}
              {(application.status === 'Pending' || application.status === 'Under Review') && !showRejectForm && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Remarks (Optional)</h3>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add any remarks or notes about this application..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Reject Form */}
              {showRejectForm && (
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-3">Reason for Rejection *</h3>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a detailed reason for rejection..."
                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows={4}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
            {(application.status === 'Pending' || application.status === 'Under Review') && !showRejectForm && (
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  disabled={isProcessing}
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  disabled={isProcessing}
                >
                  <CheckCircle className="w-5 h-5" />
                  {isProcessing ? 'Processing...' : 'Approve'}
                </button>
              </>
            )}

            {showRejectForm && (
              <>
                <button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectReason('');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                  disabled={isProcessing}
                >
                  Back
                </button>
                <button
                  onClick={handleReject}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  disabled={isProcessing}
                >
                  <XCircle className="w-5 h-5" />
                  {isProcessing ? 'Processing...' : 'Confirm Rejection'}
                </button>
              </>
            )}

            {application.status !== 'Pending' && application.status !== 'Under Review' && (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
