import { useState } from 'react';
import { Award, TrendingUp, FileText, Download, Eye } from 'lucide-react';
import jsPDF from 'jspdf';

export default function StudentResults() {
  const [selectedSemester, setSelectedSemester] = useState('Semester 5');

  // Mock results data
  const cgpaData = {
    current: 8.45,
    previous: 8.32,
    highest: 8.87,
    lowest: 7.95,
  };

  const semesterResults = [
    {
      semester: 'Semester 5',
      sgpa: 8.52,
      totalCredits: 24,
      status: 'Passed',
      subjects: [
        { code: 'CS301', name: 'Data Structures', credits: 4, grade: 'A', gradePoints: 9, marks: 87 },
        { code: 'CS302', name: 'Database Management', credits: 4, grade: 'A', gradePoints: 9, marks: 85 },
        { code: 'CS303', name: 'Operating Systems', credits: 4, grade: 'A+', gradePoints: 10, marks: 92 },
        { code: 'CS304', name: 'Computer Networks', credits: 4, grade: 'B+', gradePoints: 8, marks: 78 },
        { code: 'CS305', name: 'Software Engineering', credits: 4, grade: 'A', gradePoints: 9, marks: 83 },
        { code: 'CS306', name: 'SE Lab', credits: 2, grade: 'A+', gradePoints: 10, marks: 95 },
        { code: 'CS307', name: 'DBMS Lab', credits: 2, grade: 'A', gradePoints: 9, marks: 88 },
      ],
    },
    {
      semester: 'Semester 4',
      sgpa: 8.32,
      totalCredits: 24,
      status: 'Passed',
      subjects: [
        { code: 'CS201', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A', gradePoints: 9, marks: 85 },
        { code: 'CS202', name: 'Computer Organization', credits: 4, grade: 'B+', gradePoints: 8, marks: 76 },
        { code: 'CS203', name: 'Discrete Mathematics', credits: 4, grade: 'A', gradePoints: 9, marks: 82 },
        { code: 'CS204', name: 'Theory of Computation', credits: 4, grade: 'A+', gradePoints: 10, marks: 91 },
        { code: 'CS205', name: 'Microprocessors', credits: 4, grade: 'B+', gradePoints: 8, marks: 77 },
        { code: 'CS206', name: 'MP Lab', credits: 2, grade: 'A', gradePoints: 9, marks: 86 },
        { code: 'CS207', name: 'Algorithm Lab', credits: 2, grade: 'A+', gradePoints: 10, marks: 93 },
      ],
    },
  ];

  const allSemesters = [
    { semester: 'Semester 1', sgpa: 7.95, cgpa: 7.95, credits: 24 },
    { semester: 'Semester 2', sgpa: 8.12, cgpa: 8.04, credits: 24 },
    { semester: 'Semester 3', sgpa: 8.45, cgpa: 8.17, credits: 24 },
    { semester: 'Semester 4', sgpa: 8.32, cgpa: 8.21, credits: 24 },
    { semester: 'Semester 5', sgpa: 8.52, cgpa: 8.27, credits: 24 },
  ];

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-700 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-700 bg-blue-100';
    if (grade.startsWith('C')) return 'text-orange-700 bg-orange-100';
    return 'text-red-700 bg-red-100';
  };

  const downloadMarksheet = (semesterData: any) => {
    const doc = new jsPDF();
    
    // College Header with professional styling
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('College ERP System', 105, 18, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Academic Marksheet', 105, 30, { align: 'center' });
    
    doc.setFontSize(11);
    doc.text('Academic Year 2025-26', 105, 38, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Student Info Header Box
    doc.setFillColor(240, 249, 255);
    doc.rect(20, 52, 170, 35, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.rect(20, 52, 170, 35);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Information', 25, 60);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    // Left column
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', 25, 70);
    doc.setFont('helvetica', 'normal');
    doc.text('John Doe', 55, 70);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Roll No:', 25, 77);
    doc.setFont('helvetica', 'normal');
    doc.text('CS2023001', 55, 77);
    
    // Right column
    doc.setFont('helvetica', 'bold');
    doc.text('Program:', 120, 70);
    doc.setFont('helvetica', 'normal');
    doc.text('B.Tech Computer Science', 145, 70);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Semester:', 120, 77);
    doc.setFont('helvetica', 'normal');
    doc.text(semesterData.semester, 145, 77);
    
    // Semester details
    doc.setFillColor(254, 249, 195);
    doc.rect(20, 95, 85, 12, 'F');
    doc.setDrawColor(251, 191, 36);
    doc.rect(20, 95, 85, 12);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`SGPA: ${semesterData.sgpa}`, 25, 102);
    
    doc.setFillColor(220, 252, 231);
    doc.rect(105, 95, 85, 12, 'F');
    doc.setDrawColor(34, 197, 94);
    doc.rect(105, 95, 85, 12);
    
    doc.text(`Status: ${semesterData.status}`, 110, 102);
    
    // Table Header
    const tableTop = 115;
    doc.setFillColor(37, 99, 235);
    doc.rect(20, tableTop, 170, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Subject Code', 23, tableTop + 7);
    doc.text('Subject Name', 55, tableTop + 7);
    doc.text('Credits', 122, tableTop + 7);
    doc.text('Marks', 145, tableTop + 7);
    doc.text('Grade', 165, tableTop + 7);
    doc.text('GP', 182, tableTop + 7);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Table Content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    let yPos = tableTop + 15;
    
    semesterData.subjects.forEach((subject: any, index: number) => {
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(20, yPos - 5, 170, 9, 'F');
      }
      
      // Draw cell borders
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.1);
      doc.line(20, yPos + 4, 190, yPos + 4);
      
      doc.text(subject.code, 23, yPos);
      doc.text(subject.name.substring(0, 28), 55, yPos);
      doc.text(subject.credits.toString(), 127, yPos);
      doc.text(subject.marks.toString(), 148, yPos);
      
      // Grade with color
      const gradeColor = subject.grade.startsWith('A') ? [34, 197, 94] : 
                        subject.grade.startsWith('B') ? [59, 130, 246] : [251, 146, 60];
      doc.setTextColor(gradeColor[0], gradeColor[1], gradeColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(subject.grade, 167, yPos);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      doc.text(subject.gradePoints.toString(), 184, yPos);
      
      yPos += 9;
    });
    
    // Bottom border of table
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1);
    doc.line(20, yPos, 190, yPos);
    
    // Summary Box
    yPos += 10;
    doc.setFillColor(240, 249, 255);
    doc.rect(20, yPos, 170, 35, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.rect(20, yPos, 170, 35);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Semester Summary', 25, yPos + 10);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total Credits Earned: ${semesterData.totalCredits}`, 25, yPos + 19);
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 25, yPos + 26);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text(`SGPA: ${semesterData.sgpa}`, 130, yPos + 19);
    doc.setTextColor(34, 197, 94);
    doc.text(`Result: ${semesterData.status}`, 130, yPos + 26);
    doc.setTextColor(0, 0, 0);
    
    // Grade Legend
    yPos += 43;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Grade Legend:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text('A+ (10) | A (9) | B+ (8) | B (7) | C (6) | D (5) | F (0)', 50, yPos);
    
    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 270, 190, 270);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated marksheet and does not require a signature.', 105, 278, { align: 'center' });
    doc.text('For verification, contact the examination department at exams@college.edu', 105, 285, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text('College ERP System © 2025', 105, 292, { align: 'center' });
    
    // Save PDF
    doc.save(`Marksheet_${semesterData.semester.replace(' ', '_')}.pdf`);
  };

  const currentSemesterData = semesterResults.find((s) => s.semester === selectedSemester);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Academic Results</h1>
        <p className="text-gray-600 mt-1">View your semester results and overall performance</p>
      </div>

      {/* CGPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Current CGPA</h3>
            <Award size={24} />
          </div>
          <p className="text-4xl font-bold">{cgpaData.current}</p>
          <p className="text-sm opacity-80 mt-1">Out of 10.0</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Previous CGPA</h3>
            <TrendingUp className="text-green-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-800">{cgpaData.previous}</p>
          <p className="text-sm text-green-600 mt-1">+{(cgpaData.current - cgpaData.previous).toFixed(2)} increase</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Highest SGPA</h3>
            <Award className="text-orange-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-800">{cgpaData.highest}</p>
          <p className="text-sm text-gray-500 mt-1">Semester 3</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Credits</h3>
            <FileText className="text-purple-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-800">120</p>
          <p className="text-sm text-gray-500 mt-1">5 Semesters</p>
        </div>
      </div>

      {/* Semester-wise Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Semester-wise Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Semester</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">SGPA</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">CGPA</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Credits</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allSemesters.map((sem, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{sem.semester}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                      {sem.sgpa}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                      {sem.cgpa}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{sem.credits}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedSemester(sem.semester)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 mx-auto"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Results */}
      {currentSemesterData && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{currentSemesterData.semester} - Detailed Results</h2>
              <p className="text-sm text-gray-600 mt-1">
                SGPA: <span className="font-semibold text-blue-600">{currentSemesterData.sgpa}</span> | Status:{' '}
                <span className="font-semibold text-green-600">{currentSemesterData.status}</span>
              </p>
            </div>
            <button 
              onClick={() => downloadMarksheet(currentSemesterData)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              Download Marksheet
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject Name</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Credits</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Marks</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Grade</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Grade Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentSemesterData.subjects.map((subject, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{subject.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{subject.name}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600">{subject.credits}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                        {subject.marks}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(subject.grade)}`}>
                        {subject.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-semibold text-gray-800">{subject.gradePoints}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-sm font-bold text-gray-800">
                    Total
                  </td>
                  <td className="px-4 py-3 text-sm text-center font-bold text-gray-800">
                    {currentSemesterData.totalCredits}
                  </td>
                  <td colSpan={2} className="px-4 py-3 text-sm text-center font-bold text-gray-800">
                    SGPA: {currentSemesterData.sgpa}
                  </td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Grade Legend */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Grading System</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { grade: 'A+', points: '10', range: '90-100' },
            { grade: 'A', points: '9', range: '80-89' },
            { grade: 'B+', points: '8', range: '70-79' },
            { grade: 'B', points: '7', range: '60-69' },
            { grade: 'C', points: '6', range: '50-59' },
          ].map((item) => (
            <div key={item.grade} className="border border-gray-200 rounded-lg p-3 text-center">
              <div className={`text-2xl font-bold ${getGradeColor(item.grade).split(' ')[0]}`}>{item.grade}</div>
              <div className="text-sm text-gray-600 mt-1">{item.points} Points</div>
              <div className="text-xs text-gray-500 mt-1">{item.range}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
