import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera } from 'lucide-react';

export default function StudentProfile() {
  const { currentUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock student data - in real app, fetch from API based on currentUser.id
  const [profileData, setProfileData] = useState({
    studentId: 'STU-2024-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@college.edu',
    phone: '+91-9876543210',
    dateOfBirth: '2005-03-15',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '123 Main Street, City',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    course: 'B.Tech Computer Science',
    semester: '5th Semester',
    batch: '2021-2025',
    admissionDate: '2021-08-15',
    rollNumber: '21CSE001',
    section: 'A',
    // Guardian Details
    guardianName: 'Mr. John Doe Sr.',
    guardianRelation: 'Father',
    guardianPhone: '+91-9876543211',
    guardianEmail: 'guardian@email.com',
    // Emergency Contact
    emergencyContact: '+91-9876543212',
    emergencyContactName: 'Mrs. Jane Doe',
    emergencyContactRelation: 'Mother',
  });

  const [editData, setEditData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    // In real app, send to API
    alert('Profile updated successfully!');
  };

  const handleChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-1">View and manage your personal information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        {/* Profile Picture Section */}
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center overflow-hidden">
              <User size={48} className="text-gray-600" />
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                <Camera size={20} />
              </button>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-gray-600">{profileData.course}</p>
            <p className="text-sm text-gray-500">{profileData.studentId}</p>
          </div>

          {/* Personal Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="First Name"
                  value={isEditing ? editData.firstName : profileData.firstName}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('firstName', val)}
                />
                <InfoField
                  label="Last Name"
                  value={isEditing ? editData.lastName : profileData.lastName}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('lastName', val)}
                />
                <InfoField
                  label="Email"
                  value={isEditing ? editData.email : profileData.email}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('email', val)}
                  icon={<Mail size={16} />}
                />
                <InfoField
                  label="Phone"
                  value={isEditing ? editData.phone : profileData.phone}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('phone', val)}
                  icon={<Phone size={16} />}
                />
                <InfoField
                  label="Date of Birth"
                  value={isEditing ? editData.dateOfBirth : profileData.dateOfBirth}
                  isEditing={isEditing}
                  type={isEditing ? 'date' : 'text'}
                  onChange={(val) => handleChange('dateOfBirth', val)}
                  icon={<Calendar size={16} />}
                />
                <InfoField
                  label="Gender"
                  value={isEditing ? editData.gender : profileData.gender}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('gender', val)}
                />
                <InfoField
                  label="Blood Group"
                  value={isEditing ? editData.bloodGroup : profileData.bloodGroup}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('bloodGroup', val)}
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" />
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InfoField
                    label="Address"
                    value={isEditing ? editData.address : profileData.address}
                    isEditing={isEditing}
                    onChange={(val) => handleChange('address', val)}
                  />
                </div>
                <InfoField
                  label="City"
                  value={isEditing ? editData.city : profileData.city}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('city', val)}
                />
                <InfoField
                  label="State"
                  value={isEditing ? editData.state : profileData.state}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('state', val)}
                />
                <InfoField
                  label="Pincode"
                  value={isEditing ? editData.pincode : profileData.pincode}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('pincode', val)}
                />
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Student ID" value={profileData.studentId} isEditing={false} readOnly />
                <InfoField label="Roll Number" value={profileData.rollNumber} isEditing={false} readOnly />
                <InfoField label="Course" value={profileData.course} isEditing={false} readOnly />
                <InfoField label="Semester" value={profileData.semester} isEditing={false} readOnly />
                <InfoField label="Section" value={profileData.section} isEditing={false} readOnly />
                <InfoField label="Batch" value={profileData.batch} isEditing={false} readOnly />
                <InfoField label="Admission Date" value={profileData.admissionDate} isEditing={false} readOnly />
              </div>
            </div>

            {/* Guardian Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Guardian Name"
                  value={isEditing ? editData.guardianName : profileData.guardianName}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('guardianName', val)}
                />
                <InfoField
                  label="Relation"
                  value={isEditing ? editData.guardianRelation : profileData.guardianRelation}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('guardianRelation', val)}
                />
                <InfoField
                  label="Guardian Phone"
                  value={isEditing ? editData.guardianPhone : profileData.guardianPhone}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('guardianPhone', val)}
                  icon={<Phone size={16} />}
                />
                <InfoField
                  label="Guardian Email"
                  value={isEditing ? editData.guardianEmail : profileData.guardianEmail}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('guardianEmail', val)}
                  icon={<Mail size={16} />}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Emergency Contact Name"
                  value={isEditing ? editData.emergencyContactName : profileData.emergencyContactName}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('emergencyContactName', val)}
                />
                <InfoField
                  label="Relation"
                  value={isEditing ? editData.emergencyContactRelation : profileData.emergencyContactRelation}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('emergencyContactRelation', val)}
                />
                <InfoField
                  label="Emergency Contact Phone"
                  value={isEditing ? editData.emergencyContact : profileData.emergencyContact}
                  isEditing={isEditing}
                  onChange={(val) => handleChange('emergencyContact', val)}
                  icon={<Phone size={16} />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  type?: string;
  readOnly?: boolean;
}

function InfoField({ label, value, isEditing, onChange, icon, type = 'text', readOnly = false }: InfoFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      {isEditing && !readOnly ? (
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
          <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              icon ? 'pl-10' : ''
            }`}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          {icon && <div className="text-gray-400">{icon}</div>}
          <p className="text-gray-800">{value || '-'}</p>
        </div>
      )}
    </div>
  );
}
