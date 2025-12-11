import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];
type StudentInsert = Database['public']['Tables']['students']['Insert'];
type StudentUpdate = Database['public']['Tables']['students']['Update'];

export class StudentService {
  /**
   * Get all students
   */
  async getAll() {
    if (!isSupabaseConfigured()) {
      console.log('Using mock data - Supabase not configured');
      return [];
    }
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get student by ID
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get student by student ID
   */
  async getByStudentId(studentId: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get student by email
   */
  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create new student
   */
  async create(student: StudentInsert) {
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update student
   */
  async update(id: string, updates: StudentUpdate) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete student
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Search students
   */
  async search(query: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .or(`name.ilike.%${query}%,student_id.ilike.%${query}%,email.ilike.%${query}%`)
      .order('name');

    if (error) throw error;
    return data;
  }

  /**
   * Get students by course
   */
  async getByCourse(course: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('course', course)
      .order('name');

    if (error) throw error;
    return data;
  }

  /**
   * Get students by semester
   */
  async getBySemester(semester: number) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('semester', semester)
      .order('name');

    if (error) throw error;
    return data;
  }

  /**
   * Get students count
   */
  async getCount() {
    const { count, error } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  }
}

export const studentService = new StudentService();
