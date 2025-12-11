export type UserRole =
  | 'student'
  | 'faculty'
  | 'clerk'
  | 'admin'
  | 'fee-collector'
  | 'hostel-warden'
  | 'exam-officer'
  | 'registrar';export interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  dob: string;
  aadhaar: string;
  email: string;
  phone: string;
  course: string;
  admissionDate: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  feeBalance: number;
  hostel?: {
    building: string;
    room: string;
  };
  documents: string[];
  audit: AuditEntry[];
}

export interface AuditEntry {
  by: string;
  ts: string;
  action: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  method: 'Cash' | 'Card' | 'UPI' | 'Bank Transfer';
  date: string;
  receiptNumber: string;
  collectedBy: string;
}

export interface HostelRoom {
  id: string;
  building: string;
  floor: number;
  roomNumber: string;
  capacity: number;
  occupants: string[];
  status: 'Available' | 'Occupied' | 'Full' | 'Maintenance';
}

export interface Exam {
  id: string;
  name: string;
  course: string;
  date: string;
  subjects: string[];
  published: boolean;
}

export interface ExamResult {
  examId: string;
  studentId: string;
  marks: Record<string, number>;
  totalMarks: number;
  percentage: number;
  grade: string;
}

export interface KPIData {
  totalStudents: number;
  todayAdmissions: number;
  todayCollections: number;
  hostelOccupancy: number;
  pendingDues: number;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  read: boolean;
}
