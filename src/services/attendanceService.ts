import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { toSupabaseDate } from '../lib/dateUtils';

type Attendance = Database['public']['Tables']['attendance']['Row'];
type AttendanceInsert = Database['public']['Tables']['attendance']['Insert'];
type AttendanceUpdate = Database['public']['Tables']['attendance']['Update'];

export class AttendanceService {
  /**
   * Get all attendance records
   */
  async getAll() {
    if (!isSupabaseConfigured()) {
      console.log('Using mock data - Supabase not configured');
      return [];
    }

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get attendance by student ID
   */
  async getByStudentId(studentId: string) {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get attendance by date
   */
  async getByDate(date: Date | string) {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('date', toSupabaseDate(date))
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get attendance by course and subject
   */
  async getByCourseAndSubject(course: string, subject: string) {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('course', course)
      .eq('subject', subject)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Mark attendance for a student
   */
  async markAttendance(attendance: Omit<AttendanceInsert, 'id' | 'created_at'>) {
    if (!isSupabaseConfigured()) {
      console.log('Mock mode - attendance not saved to database');
      return null;
    }

    const { data, error } = await supabase
      .from('attendance')
      .insert([{
        ...attendance,
        date: toSupabaseDate(attendance.date),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Bulk mark attendance for multiple students
   * Deletes existing records for the date first, then inserts new ones
   */
  async bulkMarkAttendance(records: Omit<AttendanceInsert, 'id' | 'created_at'>[]) {
    if (!isSupabaseConfigured()) {
      console.log('Mock mode - attendance not saved to database');
      return [];
    }

    const formattedRecords = records.map(record => ({
      ...record,
      date: toSupabaseDate(record.date),
    }));

    if (formattedRecords.length === 0) {
      return [];
    }

    // Get the date, course, and subject from first record (all should be same)
    const { date, course, subject } = formattedRecords[0];

    // Delete existing attendance records for this date/course/subject
    await supabase
      .from('attendance')
      .delete()
      .eq('date', date)
      .eq('course', course)
      .eq('subject', subject);

    // Insert new records
    const { data, error } = await supabase
      .from('attendance')
      .insert(formattedRecords)
      .select();

    if (error) throw error;
    return data;
  }

  /**
   * Update attendance record
   */
  async update(id: string, updates: AttendanceUpdate) {
    if (!isSupabaseConfigured()) {
      console.log('Mock mode - attendance not updated in database');
      return null;
    }

    const updateData: any = { ...updates };
    if (updates.date) {
      updateData.date = toSupabaseDate(updates.date);
    }

    const { data, error } = await supabase
      .from('attendance')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete attendance record
   */
  async delete(id: string) {
    if (!isSupabaseConfigured()) {
      console.log('Mock mode - attendance not deleted from database');
      return;
    }

    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Get attendance statistics for a student
   */
  async getStudentStats(studentId: string, startDate?: Date, endDate?: Date) {
    if (!isSupabaseConfigured()) {
      return { total: 0, present: 0, absent: 0, late: 0, percentage: 0 };
    }

    let query = supabase
      .from('attendance')
      .select('status')
      .eq('student_id', studentId);

    if (startDate) {
      query = query.gte('date', toSupabaseDate(startDate));
    }
    if (endDate) {
      query = query.lte('date', toSupabaseDate(endDate));
    }

    const { data, error } = await query;
    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      present: data?.filter(a => a.status === 'Present').length || 0,
      absent: data?.filter(a => a.status === 'Absent').length || 0,
      late: data?.filter(a => a.status === 'Late').length || 0,
      percentage: 0,
    };

    if (stats.total > 0) {
      stats.percentage = Math.round((stats.present / stats.total) * 100);
    }

    return stats;
  }

  /**
   * Get attendance percentage by course
   */
  async getCourseStats(course: string, startDate?: Date, endDate?: Date) {
    if (!isSupabaseConfigured()) {
      return { total: 0, present: 0, absent: 0, late: 0, percentage: 0 };
    }

    let query = supabase
      .from('attendance')
      .select('status')
      .eq('course', course);

    if (startDate) {
      query = query.gte('date', toSupabaseDate(startDate));
    }
    if (endDate) {
      query = query.lte('date', toSupabaseDate(endDate));
    }

    const { data, error } = await query;
    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      present: data?.filter(a => a.status === 'Present').length || 0,
      absent: data?.filter(a => a.status === 'Absent').length || 0,
      late: data?.filter(a => a.status === 'Late').length || 0,
      percentage: 0,
    };

    if (stats.total > 0) {
      stats.percentage = Math.round((stats.present / stats.total) * 100);
    }

    return stats;
  }
}

// Export singleton instance
export const attendanceService = new AttendanceService();
