import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Payment, HostelRoom, Exam, UserRole, NotificationItem } from '../types';
import { mockStudents, mockPayments, mockHostelRooms, mockExams } from '../data/mockData';
import { isSupabaseConfigured } from '../lib/supabase';
import { studentService } from '../services/studentService';
import { feeService } from '../services/feeService';
import { hostelService } from '../services/hostelService';
import { toSupabaseDate } from '../lib/dateUtils';

interface AppContextType {
  currentUser: {
    name: string;
    role: UserRole;
    id: string;
  };
  students: Student[];
  payments: Payment[];
  hostelRooms: HostelRoom[];
  exams: Exam[];
  notifications: NotificationItem[];
  setCurrentUser: (user: { name: string; role: UserRole; id: string }) => void;
  addStudent: (student: Student) => Promise<void>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  addPayment: (payment: Payment) => Promise<void>;
  updateHostelRoom: (id: string, updates: Partial<HostelRoom>) => Promise<void>;
  addNotification: (notification: NotificationItem) => void;
  markNotificationRead: (id: string) => void;
  refreshData: () => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useSupabase = isSupabaseConfigured();

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState({
    name: 'Admin User',
    role: 'admin' as UserRole,
    id: 'admin-001',
  });

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>(() => {
    if (!useSupabase) {
      const stored = localStorage.getItem('students');
      return stored ? JSON.parse(stored) : mockStudents;
    }
    return [];
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    if (!useSupabase) {
      const stored = localStorage.getItem('payments');
      return stored ? JSON.parse(stored) : mockPayments;
    }
    return [];
  });

  const [hostelRooms, setHostelRooms] = useState<HostelRoom[]>(() => {
    if (!useSupabase) {
      const stored = localStorage.getItem('hostelRooms');
      return stored ? JSON.parse(stored) : mockHostelRooms;
    }
    return [];
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    if (!useSupabase) {
      const stored = localStorage.getItem('exams');
      return stored ? JSON.parse(stored) : mockExams;
    }
    return [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Load data from Supabase on mount
  useEffect(() => {
    if (useSupabase) {
      refreshData();
    }
  }, []);

  // Refresh data from Supabase
  const refreshData = async () => {
    if (!useSupabase) return;
    
    setLoading(true);
    try {
      // Load real data from Supabase
      const [studentsData, paymentsData, roomsData] = await Promise.all([
        studentService.getAll().catch(() => []),
        feeService.getPayments().catch(() => []),
        hostelService.getAllRooms().catch(() => []),
      ]);
      
      // Use Supabase data if available, otherwise use mock data
      setStudents(studentsData?.length ? studentsData as any : mockStudents);
      setPayments(paymentsData?.length ? paymentsData as any : mockPayments);
      setHostelRooms(roomsData?.length ? roomsData as any : mockHostelRooms);
      setExams(mockExams); // Keep using mock exams for now
      
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      // Fallback to mock data
      setStudents(mockStudents);
      setPayments(mockPayments);
      setHostelRooms(mockHostelRooms);
      setExams(mockExams);
    } finally {
      setLoading(false);
    }
  };

  // Persist to localStorage only if not using Supabase
  useEffect(() => {
    if (!useSupabase) {
      localStorage.setItem('students', JSON.stringify(students));
    }
  }, [students]);

  useEffect(() => {
    if (!useSupabase) {
      localStorage.setItem('payments', JSON.stringify(payments));
    }
  }, [payments]);

  useEffect(() => {
    if (!useSupabase) {
      localStorage.setItem('hostelRooms', JSON.stringify(hostelRooms));
    }
  }, [hostelRooms]);

  useEffect(() => {
    if (!useSupabase) {
      localStorage.setItem('exams', JSON.stringify(exams));
    }
  }, [exams]);

  const addStudent = async (student: Student) => {
    if (useSupabase) {
      try {
        const created = await studentService.create({
          student_id: student.studentId,
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          phone: student.phone,
          date_of_birth: toSupabaseDate(student.dob),
          gender: 'Male',
          course: student.course,
          semester: 1,
          cgpa: 0,
          address: '',
          guardian_name: '',
          guardian_phone: '',
        });
        await refreshData();
      } catch (error) {
        console.error('Error saving student:', error);
        setStudents((prev) => [...prev, student]);
      }
    } else {
      setStudents((prev) => [...prev, student]);
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    if (useSupabase) {
      try {
        const student = students.find(s => s.studentId === id);
        if (student && (student as any).id) {
          const updateData: any = {};
          if (updates.course) updateData.course = updates.course;
          if (updates.status) updateData.status = updates.status;
          
          await studentService.update((student as any).id, updateData);
          await refreshData();
        } else {
          setStudents((prev) =>
            prev.map((student) =>
              student.studentId === id ? { ...student, ...updates } : student
            )
          );
        }
      } catch (error) {
        console.error('Error updating student:', error);
        setStudents((prev) =>
          prev.map((student) =>
            student.studentId === id ? { ...student, ...updates } : student
          )
        );
      }
    } else {
      setStudents((prev) =>
        prev.map((student) =>
          student.studentId === id ? { ...student, ...updates } : student
        )
      );
    }
  };

  const addPayment = async (payment: Payment) => {
    if (useSupabase) {
      try {
        const student = students.find((s) => s.studentId === payment.studentId);
        if (student && (student as any).id) {
          await feeService.createPayment({
            student_id: (student as any).id,
            amount: payment.amount,
            due_date: new Date().toISOString(),
            payment_method: payment.method as any,
            transaction_id: payment.receiptNumber,
          });
          console.log('✅ Payment saved to Supabase instantly!');
          await refreshData();
        } else {
          console.warn('⚠️ Student not found, saving payment locally only');
          setPayments((prev) => [...prev, payment]);
        }
      } catch (error) {
        console.error('Error saving payment:', error);
        setPayments((prev) => [...prev, payment]);
      }
    } else {
      setPayments((prev) => [...prev, payment]);
      const student = students.find((s) => s.studentId === payment.studentId);
      if (student) {
        updateStudent(payment.studentId, {
          feeBalance: student.feeBalance - payment.amount,
        });
      }
    }
  };

  const updateHostelRoom = async (id: string, updates: Partial<HostelRoom>) => {
    if (useSupabase) {
      try {
        const updateData: any = {};
        if (updates.status) updateData.status = updates.status;
        
        await hostelService.updateRoom(id, updateData);
        await refreshData();
      } catch (error) {
        console.error('Error updating hostel room:', error);
        setHostelRooms((prev) =>
          prev.map((room) => (room.id === id ? { ...room, ...updates } : room))
        );
      }
    } else {
      setHostelRooms((prev) =>
        prev.map((room) => (room.id === id ? { ...room, ...updates } : room))
      );
    }
  };

  const addNotification = (notification: NotificationItem) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        students,
        payments,
        hostelRooms,
        exams,
        notifications,
        setCurrentUser,
        addStudent,
        updateStudent,
        addPayment,
        updateHostelRoom,
        addNotification,
        markNotificationRead,
        refreshData,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
