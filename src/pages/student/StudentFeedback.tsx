import { useState } from 'react';
import { MessageSquare, Send, Star, CheckCircle } from 'lucide-react';

export default function StudentFeedback() {
  const [selectedCategory, setSelectedCategory] = useState('Faculty');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const categories = ['Faculty', 'Infrastructure', 'Administration', 'Library', 'Hostel', 'Canteen', 'Other'];

  const facultyList = [
    { id: 1, name: 'Dr. Smith Johnson', subject: 'Data Structures', department: 'CSE' },
    { id: 2, name: 'Prof. Emily Davis', subject: 'Database Management', department: 'CSE' },
    { id: 3, name: 'Dr. Michael Brown', subject: 'Operating Systems', department: 'CSE' },
  ];

  const [selectedFaculty, setSelectedFaculty] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || rating === 0) {
      alert('Please provide a rating and feedback');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback('');
      setRating(0);
      setSelectedFaculty('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Feedback & Suggestions</h1>
        <p className="text-gray-600 mt-1">Share your valuable feedback to help us improve</p>
      </div>

      {submitted && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-scale-up">
          <div className="flex items-center">
            <CheckCircle className="text-green-600 mr-3" size={24} />
            <div>
              <h3 className="text-green-800 font-semibold">Thank you for your feedback!</h3>
              <p className="text-green-700 text-sm mt-1">Your feedback has been submitted successfully.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Feedback Category *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Faculty Selection (if category is Faculty) */}
          {selectedCategory === 'Faculty' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Faculty *</label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a faculty member...</option>
                {facultyList.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name} - {faculty.subject} ({faculty.department})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Rating *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-semibold text-gray-700">
                  {rating === 5 && 'Excellent'}
                  {rating === 4 && 'Good'}
                  {rating === 3 && 'Average'}
                  {rating === 2 && 'Poor'}
                  {rating === 1 && 'Very Poor'}
                </span>
              )}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Feedback *</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please share your detailed feedback, suggestions, or concerns..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">{feedback.length} / 500 characters</p>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="anonymous" className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              Submit anonymously
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setFeedback('');
                setRating(0);
                setSelectedFaculty('');
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Clear
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Submit Feedback
            </button>
          </div>
        </form>
      </div>

      {/* Previous Feedback (optional) */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MessageSquare size={24} className="text-blue-600" />
          Your Previous Feedback
        </h2>
        <div className="space-y-3">
          {[
            {
              category: 'Faculty',
              rating: 5,
              comment: 'Excellent teaching methodology and very supportive.',
              date: '2025-09-15',
              status: 'Reviewed',
            },
            {
              category: 'Library',
              rating: 4,
              comment: 'Good collection of books. Could use more study spaces.',
              date: '2025-08-20',
              status: 'Pending',
            },
          ].map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'Reviewed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{item.comment}</p>
              <p className="text-xs text-gray-500">Submitted on {new Date(item.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
