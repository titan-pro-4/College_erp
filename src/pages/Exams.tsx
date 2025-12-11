import { useApp } from '../contexts/AppContext';
import { FileText, Upload, CheckCircle } from 'lucide-react';

export default function Exams() {
  const { exams } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Examination Management</h1>
          <p className="text-gray-600 mt-1">Create exams and manage results</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn btn-secondary flex items-center space-x-2">
            <Upload size={18} />
            <span>Upload Marks</span>
          </button>
          <button className="btn btn-primary flex items-center space-x-2">
            <FileText size={18} />
            <span>Create Exam</span>
          </button>
        </div>
      </div>

      {/* Exams List */}
      <div className="grid gap-4">
        {exams.map((exam) => (
          <div key={exam.id} className="card hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{exam.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{exam.course}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                  <span>📅 {exam.date}</span>
                  <span>📚 {exam.subjects.length} subjects</span>
                </div>
                <div className="mt-2">
                  <div className="text-xs text-gray-500">Subjects:</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {exam.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {exam.published ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center space-x-1">
                    <CheckCircle size={14} />
                    <span>Published</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    Draft
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-200">
              <button className="btn btn-secondary text-sm">View Details</button>
              <button className="btn btn-secondary text-sm">Upload Marks</button>
              {!exam.published && (
                <button className="btn btn-primary text-sm">Publish Results</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
