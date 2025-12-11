import { Download, Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';

export default function StudentAdmitCard() {
  const examSchedule = [
    {
      examId: 'EX-2025-001',
      subject: 'Data Structures',
      code: 'CS301',
      date: '2025-10-15',
      time: '10:00 AM - 01:00 PM',
      hall: 'Block A - Hall 101',
      seat: 'A-42',
      status: 'Available',
    },
    {
      examId: 'EX-2025-002',
      subject: 'Database Management',
      code: 'CS302',
      date: '2025-10-18',
      time: '10:00 AM - 01:00 PM',
      hall: 'Block A - Hall 102',
      seat: 'A-42',
      status: 'Available',
    },
    {
      examId: 'EX-2025-003',
      subject: 'Operating Systems',
      code: 'CS303',
      date: '2025-10-21',
      time: '02:00 PM - 05:00 PM',
      hall: 'Block B - Hall 201',
      seat: 'B-15',
      status: 'Available',
    },
  ];

  const studentInfo = {
    name: 'John Doe',
    rollNo: '21CSE001',
    course: 'B.Tech Computer Science',
    semester: 'Semester 5',
    batch: '2021-2025',
    photo: null,
  };

  const downloadAdmitCard = (exam: any) => {
    const doc = new jsPDF();
    
    // College Header with professional styling
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 48, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('College ERP System', 105, 18, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Examination Admit Card', 105, 30, { align: 'center' });
    
    doc.setFontSize(11);
    doc.text(`${studentInfo.semester} - Academic Year 2025-26`, 105, 40, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Photo placeholder box with better styling
    doc.setFillColor(240, 240, 240);
    doc.rect(150, 55, 40, 50, 'F');
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(1);
    doc.rect(150, 55, 40, 50);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('Student', 170, 77, { align: 'center' });
    doc.text('Photo', 170, 83, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    
    // Student Information Box
    doc.setFillColor(240, 249, 255);
    doc.rect(20, 55, 125, 50, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.rect(20, 55, 125, 50);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Student Information', 25, 63);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const leftMargin = 25;
    let yPos = 73;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', leftMargin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(studentInfo.name, leftMargin + 30, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Roll Number:', leftMargin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(studentInfo.rollNo, leftMargin + 30, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Course:', leftMargin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(studentInfo.course, leftMargin + 30, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Batch:', leftMargin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(studentInfo.batch, leftMargin + 30, yPos);
    
    // Exam Details Section Header
    yPos = 115;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Examination Details', 20, yPos);
    
    // Exam Details Box - Enhanced
    yPos += 5;
    doc.setFillColor(254, 249, 195);
    doc.rect(20, yPos, 170, 60, 'F');
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(1);
    doc.rect(20, yPos, 170, 60);
    
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Subject:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`${exam.subject}`, 60, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Subject Code: ${exam.code}`, 60, yPos);
    doc.setTextColor(0, 0, 0);
    
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Exam Date:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(exam.date).toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), 60, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Time:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(exam.time, 60, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Exam Hall:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(exam.hall, 60, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Seat Number:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(220, 38, 38);
    doc.text(exam.seat, 60, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    
    // Important Instructions Box
    yPos += 18;
    doc.setFillColor(254, 226, 226);
    doc.rect(20, yPos, 170, 8, 'F');
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.8);
    doc.rect(20, yPos, 170, 8);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(153, 27, 27);
    doc.text('⚠ Important Instructions - Please Read Carefully', 25, yPos + 6);
    doc.setTextColor(0, 0, 0);
    
    yPos += 15;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    const instructions = [
      '1. Carry this admit card along with a valid photo ID proof (Aadhar/Driving License/Passport)',
      '2. Report to the examination center at least 30 minutes before the scheduled time',
      '3. Mobile phones, smartwatches, and electronic devices are strictly prohibited',
      '4. Use of unfair means will result in cancellation of examination and disciplinary action',
      '5. Follow all instructions given by the invigilators during the examination',
      '6. Candidates are not allowed to leave the examination hall before completion'
    ];
    
    instructions.forEach((instruction) => {
      doc.text(instruction, 20, yPos);
      yPos += 6;
    });
    
    // Declaration Box
    yPos += 5;
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.3);
    doc.rect(20, yPos, 170, 18);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Declaration: I have read and understood all the examination rules and regulations.', 25, yPos + 6);
    doc.text('I shall abide by them during the examination.', 25, yPos + 11);
    
    // Signature section with lines
    yPos += 23;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(25, yPos, 80, yPos);
    doc.line(130, yPos, 185, yPos);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Signature', 42, yPos + 5, { align: 'center' });
    doc.text('Controller of Examinations', 157, yPos + 5, { align: 'center' });
    
    // Footer with official stamp area
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 272, 210, 25, 'F');
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, 272, 190, 272);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated admit card and does not require a seal or signature.', 105, 279, { align: 'center' });
    doc.text('For any queries, contact the examination department at exams@college.edu', 105, 285, { align: 'center' });
    
    // Exam ID at bottom with barcode-like appearance
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(`Exam ID: ${exam.examId}`, 105, 292, { align: 'center' });
    
    // Save PDF with descriptive filename
    const fileName = `AdmitCard_${studentInfo.rollNo}_${exam.code}_${exam.subject.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  };

  const handleDownload = (examId: string) => {
    const exam = examSchedule.find(e => e.examId === examId);
    if (exam) {
      downloadAdmitCard(exam);
    }
  };

  const handleDownloadAll = () => {
    examSchedule.forEach((exam, index) => {
      setTimeout(() => {
        downloadAdmitCard(exam);
      }, index * 500); // Stagger downloads by 500ms
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admit Cards</h1>
          <p className="text-gray-600 mt-1">Download your examination admit cards</p>
        </div>
        <button
          onClick={handleDownloadAll}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={18} />
          Download All
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="text-yellow-600 mt-1 mr-3" size={20} />
          <div>
            <h3 className="text-yellow-800 font-semibold">Important Instructions</h3>
            <ul className="text-yellow-700 text-sm mt-2 space-y-1 list-disc list-inside">
              <li>Download and print your admit card before the exam date</li>
              <li>Carry a valid photo ID along with the admit card</li>
              <li>Report to the examination hall 30 minutes before the exam</li>
              <li>Electronic devices are strictly prohibited in the exam hall</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Student Information Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Student Name</label>
              <p className="font-semibold text-gray-800">{studentInfo.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Roll Number</label>
              <p className="font-semibold text-gray-800">{studentInfo.rollNo}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Course</label>
              <p className="font-semibold text-gray-800">{studentInfo.course}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Semester</label>
              <p className="font-semibold text-gray-800">{studentInfo.semester}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Batch</label>
              <p className="font-semibold text-gray-800">{studentInfo.batch}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Schedule & Admit Cards */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Examination Schedule</h2>
        <div className="space-y-4">
          {examSchedule.map((exam) => (
            <div key={exam.examId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="text-blue-600" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{exam.subject}</h3>
                      <p className="text-sm text-gray-600">Code: {exam.code}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <label className="text-gray-600 flex items-center gap-1">
                        <Calendar size={14} />
                        Date
                      </label>
                      <p className="font-semibold text-gray-800">{new Date(exam.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Time</label>
                      <p className="font-semibold text-gray-800">{exam.time}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Examination Hall</label>
                      <p className="font-semibold text-gray-800">{exam.hall}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Seat Number</label>
                      <p className="font-semibold text-gray-800">{exam.seat}</p>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      exam.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <CheckCircle size={14} />
                    {exam.status}
                  </span>
                  <button
                    onClick={() => handleDownload(exam.examId)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Exam Guidelines</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-0.5" size={16} />
            <p>Students must carry their admit card and valid photo ID to the examination hall</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-0.5" size={16} />
            <p>Report to the examination center at least 30 minutes before the scheduled time</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-0.5" size={16} />
            <p>Mobile phones and electronic devices are not allowed in the examination hall</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-0.5" size={16} />
            <p>Use of unfair means will result in cancellation of the examination</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-0.5" size={16} />
            <p>Follow all instructions given by the invigilators during the examination</p>
          </div>
        </div>
      </div>
    </div>
  );
}
