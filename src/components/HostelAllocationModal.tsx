import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Home, User, Mail, Phone, Calendar, MapPin, Bed } from 'lucide-react';

interface HostelRequest {
  id: string;
  student: string;
  studentId?: string;
  email?: string;
  phone?: string;
  course?: string;
  semester?: string;
  room: string; // Preferred block
  date: string;
  status: string;
  reason?: string;
  gender?: string;
  medicalConditions?: string;
}

interface HostelAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: HostelRequest | null;
  onApprove: (id: string, allocatedRoom: string, remarks?: string) => void;
  onReject: (id: string, reason: string) => void;
}

const HostelAllocationModal: React.FC<HostelAllocationModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}) => {
  const [allocatedBlock, setAllocatedBlock] = useState('');
  const [allocatedRoom, setAllocatedRoom] = useState('');
  const [remarks, setRemarks] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !request) return null;

  // Available rooms by block
  const availableRooms = {
    'A-Block': ['A-101', 'A-102', 'A-103', 'A-201', 'A-202', 'A-203', 'A-301', 'A-302'],
    'B-Block': ['B-101', 'B-102', 'B-103', 'B-201', 'B-202', 'B-203', 'B-301', 'B-302'],
    'C-Block': ['C-101', 'C-102', 'C-103', 'C-201', 'C-202', 'C-203', 'C-301', 'C-302'],
  };

  const handleApprove = async () => {
    if (!allocatedBlock || !allocatedRoom) {
      alert('Please select both block and room number');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    onApprove(request.id, `${allocatedRoom}`, remarks);
    setIsProcessing(false);
    resetForm();
    onClose();
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    onReject(request.id, rejectReason);
    setIsProcessing(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setAllocatedBlock('');
    setAllocatedRoom('');
    setRemarks('');
    setRejectReason('');
    setShowRejectForm(false);
  };

  const handleBlockChange = (block: string) => {
    setAllocatedBlock(block);
    setAllocatedRoom(''); // Reset room when block changes
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
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Hostel Room Allocation</h2>
                <p className="text-sm opacity-90 mt-1">{request.id}</p>
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
            {/* Request Status */}
            <div className="mb-6">
              <div className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold ${
                request.status === 'Approved' ? 'bg-green-100 text-green-700' :
                request.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                <Home className="w-5 h-5 mr-2" />
                Status: {request.status}
              </div>
            </div>

            {/* Student Information */}
            <div className="space-y-6">
              {/* Personal Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Student Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Student Name</label>
                    <p className="font-semibold text-gray-800">{request.student}</p>
                  </div>
                  {request.studentId && (
                    <div>
                      <label className="text-sm text-gray-600">Student ID</label>
                      <p className="font-semibold text-gray-800">{request.studentId}</p>
                    </div>
                  )}
                  {request.email && (
                    <div>
                      <label className="text-sm text-gray-600 flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </label>
                      <p className="font-semibold text-gray-800">{request.email}</p>
                    </div>
                  )}
                  {request.phone && (
                    <div>
                      <label className="text-sm text-gray-600 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Phone
                      </label>
                      <p className="font-semibold text-gray-800">{request.phone}</p>
                    </div>
                  )}
                  {request.course && (
                    <div>
                      <label className="text-sm text-gray-600">Course</label>
                      <p className="font-semibold text-gray-800">{request.course}</p>
                    </div>
                  )}
                  {request.semester && (
                    <div>
                      <label className="text-sm text-gray-600">Semester</label>
                      <p className="font-semibold text-gray-800">{request.semester}</p>
                    </div>
                  )}
                  {request.gender && (
                    <div>
                      <label className="text-sm text-gray-600">Gender</label>
                      <p className="font-semibold text-gray-800">{request.gender}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Request Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Home className="w-5 h-5 mr-2 text-purple-600" />
                  Hostel Request Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Preferred Block
                    </label>
                    <p className="font-semibold text-gray-800">{request.room}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Request Date
                    </label>
                    <p className="font-semibold text-gray-800">{request.date}</p>
                  </div>
                  {request.reason && (
                    <div className="col-span-2">
                      <label className="text-sm text-gray-600">Request Reason</label>
                      <p className="font-semibold text-gray-800">{request.reason}</p>
                    </div>
                  )}
                  {request.medicalConditions && (
                    <div className="col-span-2">
                      <label className="text-sm text-gray-600">Medical Conditions</label>
                      <p className="font-semibold text-gray-800 text-red-600">{request.medicalConditions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Room Allocation Section */}
              {request.status === 'Pending' && !showRejectForm && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Bed className="w-5 h-5 mr-2 text-green-600" />
                    Allocate Room
                  </h3>
                  <div className="bg-green-50 rounded-lg p-4 space-y-4 border-2 border-green-200">
                    {/* Block Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Block *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.keys(availableRooms).map((block) => (
                          <button
                            key={block}
                            onClick={() => handleBlockChange(block)}
                            className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                              allocatedBlock === block
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {block}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Room Selection */}
                    {allocatedBlock && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Select Room Number *
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {availableRooms[allocatedBlock as keyof typeof availableRooms].map((room) => (
                            <button
                              key={room}
                              onClick={() => setAllocatedRoom(room)}
                              className={`px-3 py-2 rounded-lg border-2 font-medium transition-all ${
                                allocatedRoom === room
                                  ? 'bg-green-500 text-white border-green-500'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                              }`}
                            >
                              {room}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Remarks */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Remarks (Optional)
                      </label>
                      <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Add any remarks about this allocation..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Reject Form */}
              {showRejectForm && (
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-3">Reason for Rejection *</h3>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a detailed reason for rejection (e.g., 'No rooms available in preferred block', 'Student eligibility criteria not met')..."
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
            {request.status === 'Pending' && !showRejectForm && (
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
                  {isProcessing ? 'Processing...' : 'Allocate Room'}
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

            {request.status !== 'Pending' && (
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

export default HostelAllocationModal;
