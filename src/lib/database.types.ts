export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'clerk' | 'faculty' | 'student' | 'hostel-manager'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'admin' | 'clerk' | 'faculty' | 'student' | 'hostel-manager'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'clerk' | 'faculty' | 'student' | 'hostel-manager'
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          student_id: string
          name: string
          email: string
          phone: string
          course: string
          semester: number
          cgpa: number
          gender: 'Male' | 'Female' | 'Other'
          date_of_birth: string
          address: string
          guardian_name: string
          guardian_phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          name: string
          email: string
          phone: string
          course: string
          semester: number
          cgpa?: number
          gender: 'Male' | 'Female' | 'Other'
          date_of_birth: string
          address: string
          guardian_name: string
          guardian_phone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          name?: string
          email?: string
          phone?: string
          course?: string
          semester?: number
          cgpa?: number
          gender?: 'Male' | 'Female' | 'Other'
          date_of_birth?: string
          address?: string
          guardian_name?: string
          guardian_phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      admissions: {
        Row: {
          id: string
          student_name: string
          email: string
          phone: string
          course: string
          gender: 'Male' | 'Female' | 'Other'
          date_of_birth: string
          address: string
          guardian_name: string
          guardian_phone: string
          status: 'Pending' | 'Approved' | 'Rejected'
          remarks: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_name: string
          email: string
          phone: string
          course: string
          gender: 'Male' | 'Female' | 'Other'
          date_of_birth: string
          address: string
          guardian_name: string
          guardian_phone: string
          status?: 'Pending' | 'Approved' | 'Rejected'
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_name?: string
          email?: string
          phone?: string
          course?: string
          gender?: 'Male' | 'Female' | 'Other'
          date_of_birth?: string
          address?: string
          guardian_name?: string
          guardian_phone?: string
          status?: 'Pending' | 'Approved' | 'Rejected'
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fees: {
        Row: {
          id: string
          student_id: string
          amount: number
          due_date: string
          status: 'Pending' | 'Paid' | 'Overdue'
          payment_date: string | null
          transaction_id: string | null
          payment_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          amount: number
          due_date: string
          status?: 'Pending' | 'Paid' | 'Overdue'
          payment_date?: string | null
          transaction_id?: string | null
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          amount?: number
          due_date?: string
          status?: 'Pending' | 'Paid' | 'Overdue'
          payment_date?: string | null
          transaction_id?: string | null
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      hostel_applications: {
        Row: {
          id: string
          student_id: string
          student_name: string
          course: string
          semester: string
          gender: 'Male' | 'Female'
          cgpa: number
          distance: string
          status: 'Pending' | 'Approved' | 'Rejected'
          allocated_room: string | null
          allocated_block: string | null
          allocated_floor: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          student_name: string
          course: string
          semester: string
          gender: 'Male' | 'Female'
          cgpa: number
          distance: string
          status?: 'Pending' | 'Approved' | 'Rejected'
          allocated_room?: string | null
          allocated_block?: string | null
          allocated_floor?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          student_name?: string
          course?: string
          semester?: string
          gender?: 'Male' | 'Female'
          cgpa?: number
          distance?: string
          status?: 'Pending' | 'Approved' | 'Rejected'
          allocated_room?: string | null
          allocated_block?: string | null
          allocated_floor?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      hostel_maintenance: {
        Row: {
          id: string
          room: string
          block: string
          issue_type: 'Electrical' | 'Plumbing' | 'Furniture' | 'Other'
          description: string
          priority: 'High' | 'Medium' | 'Low'
          status: 'Pending' | 'In Progress' | 'Resolved'
          reported_by: string
          reported_date: string
          resolved_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room: string
          block: string
          issue_type: 'Electrical' | 'Plumbing' | 'Furniture' | 'Other'
          description: string
          priority: 'High' | 'Medium' | 'Low'
          status?: 'Pending' | 'In Progress' | 'Resolved'
          reported_by: string
          reported_date: string
          resolved_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room?: string
          block?: string
          issue_type?: 'Electrical' | 'Plumbing' | 'Furniture' | 'Other'
          description?: string
          priority?: 'High' | 'Medium' | 'Low'
          status?: 'Pending' | 'In Progress' | 'Resolved'
          reported_by?: string
          reported_date?: string
          resolved_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          course: string
          subject: string
          exam_date: string
          start_time: string
          end_time: string
          room: string
          semester: number
          total_marks: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course: string
          subject: string
          exam_date: string
          start_time: string
          end_time: string
          room: string
          semester: number
          total_marks: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course?: string
          subject?: string
          exam_date?: string
          start_time?: string
          end_time?: string
          room?: string
          semester?: number
          total_marks?: number
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          course: string
          subject: string
          date: string
          status: 'Present' | 'Absent' | 'Late'
          marked_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course: string
          subject: string
          date: string | Date
          status: 'Present' | 'Absent' | 'Late'
          marked_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course?: string
          subject?: string
          date?: string | Date
          status?: 'Present' | 'Absent' | 'Late'
          marked_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'info' | 'warning' | 'error' | 'success'
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'info' | 'warning' | 'error' | 'success'
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'info' | 'warning' | 'error' | 'success'
          message?: string
          read?: boolean
          created_at?: string
        }
      }
      fee_payments: {
        Row: {
          id: string
          student_id: string
          amount: number
          due_date: string
          status: 'Pending' | 'Paid' | 'Overdue'
          payment_date: string | null
          transaction_id: string | null
          payment_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          amount: number
          due_date: string
          status?: 'Pending' | 'Paid' | 'Overdue'
          payment_date?: string | null
          transaction_id?: string | null
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          amount?: number
          due_date?: string
          status?: 'Pending' | 'Paid' | 'Overdue'
          payment_date?: string | null
          transaction_id?: string | null
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      hostel_rooms: {
        Row: {
          id: string
          room_number: string
          block: string
          floor: number
          capacity: number
          gender: 'Male' | 'Female'
          status: 'Available' | 'Occupied' | 'Maintenance'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_number: string
          block: string
          floor: number
          capacity: number
          gender: 'Male' | 'Female'
          status?: 'Available' | 'Occupied' | 'Maintenance'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_number?: string
          block?: string
          floor?: number
          capacity?: number
          gender?: 'Male' | 'Female'
          status?: 'Available' | 'Occupied' | 'Maintenance'
          created_at?: string
          updated_at?: string
        }
      }
      hostel_allocations: {
        Row: {
          id: string
          student_id: string
          room_id: string
          allocation_date: string
          check_in_date: string | null
          check_out_date: string | null
          status: 'Active' | 'CheckedOut' | 'Cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          room_id: string
          allocation_date: string
          check_in_date?: string | null
          check_out_date?: string | null
          status?: 'Active' | 'CheckedOut' | 'Cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          room_id?: string
          allocation_date?: string
          check_in_date?: string | null
          check_out_date?: string | null
          status?: 'Active' | 'CheckedOut' | 'Cancelled'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'clerk' | 'faculty' | 'student' | 'hostel-manager'
      admission_status: 'Pending' | 'Approved' | 'Rejected'
      fee_status: 'Pending' | 'Paid' | 'Overdue'
      maintenance_status: 'Pending' | 'In Progress' | 'Resolved'
    }
  }
}
