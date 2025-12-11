import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { admissionService } from '../services/admissionService';
import { smsService } from '../services/smsService';
import { toSupabaseDate } from '../lib/dateUtils';

export default function PublicAdmission() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    phone: '',
    aadhaar: '',
    course: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create admission application in Supabase
      const admission = await admissionService.create({
        student_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        gender: formData.gender,
        date_of_birth: toSupabaseDate(formData.dob),
        address: formData.address,
        guardian_name: formData.guardianName,
        guardian_phone: formData.guardianPhone,
        status: 'Pending' as const,
      });

      // Generate application ID for display
      const appId = `APP-2025-${admission.id.slice(0, 8).toUpperCase()}`;
      setApplicationId(appId);

      // Send confirmation SMS (if enabled)
      try {
        await smsService.sendNotification(
          formData.phone,
          `Your admission application has been received. Application ID: ${appId}. We will contact you soon.`
        );
      } catch (smsError) {
        console.error('SMS failed, but application was successful:', smsError);
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Admission submission error:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-accent-success/10 flex items-center justify-center p-4">
        <div className="bg-white rounded-card shadow-lg p-8 max-w-md w-full text-center animate-scale-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-accent-success" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Application Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-2">
            Your application has been received. Application ID:
          </p>
          <p className="text-2xl font-bold text-primary mb-6">
            {applicationId}
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Please save this Application ID for future reference. You will receive an email confirmation shortly with further instructions.
          </p>
          <div className="space-y-3">
            <Link
              to="/"
              className="btn btn-primary w-full"
            >
              Back to Home
            </Link>
            <Link
              to="/login?role=student"
              className="btn btn-secondary w-full"
            >
              Login to Check Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-accent-success/10 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-primary hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white rounded-card shadow-lg p-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">New Student Admission</h1>
          <p className="text-gray-600 mb-8">Fill in your details to apply for admission</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">Error submitting application</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-primary' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={step >= 1 ? 'text-primary font-medium' : 'text-gray-500'}>Personal Info</span>
              <span className={step >= 2 ? 'text-primary font-medium' : 'text-gray-500'}>Contact Details</span>
              <span className={step >= 3 ? 'text-primary font-medium' : 'text-gray-500'}>Course Selection</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Date of Birth *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="input pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Aadhaar Number *</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="aadhaar"
                        value={formData.aadhaar}
                        onChange={handleChange}
                        className="input pl-10"
                        pattern="[0-9]{12}"
                        placeholder="XXXX-XXXX-XXXX"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn btn-primary w-full"
                >
                  Next: Contact Details
                </button>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="label">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input pl-10"
                      pattern="[+][0-9]{2}-[0-9]{10}"
                      placeholder="+91-XXXXXXXXXX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input"
                    rows={3}
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Guardian Name *</label>
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Guardian Phone *</label>
                    <input
                      type="tel"
                      name="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={handleChange}
                      className="input"
                      pattern="[+][0-9]{2}-[0-9]{10}"
                      placeholder="+91-XXXXXXXXXX"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn btn-primary flex-1"
                  >
                    Next: Course Selection
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Course Selection */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="label">Select Course *</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Choose a course</option>
                    <option value="BSc Computer Science">BSc Computer Science</option>
                    <option value="BA English Literature">BA English Literature</option>
                    <option value="BCom Accounting">BCom Accounting</option>
                    <option value="BTech Engineering">BTech Engineering</option>
                    <option value="BBA Business Administration">BBA Business Administration</option>
                  </select>
                </div>

                <div>
                  <label className="label">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your application will be reviewed by our admissions team</li>
                    <li>• You'll receive an email with your Application ID</li>
                    <li>• Check your email for further instructions</li>
                    <li>• Login to track your application status</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-secondary flex-1"
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
