import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { toSupabaseDate, toSupabaseTimestamp } from '../lib/dateUtils';

type Admission = Database['public']['Tables']['admissions']['Row'];
type AdmissionInsert = Database['public']['Tables']['admissions']['Insert'];
type AdmissionUpdate = Database['public']['Tables']['admissions']['Update'];

export class AdmissionService {
  /**
   * Get all admissions
   */
  async getAll() {
    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get admission by ID
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get admissions by status
   */
  async getByStatus(status: 'pending' | 'approved' | 'rejected') {
    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get pending admissions (needs approval)
   */
  async getPending() {
    return this.getByStatus('pending');
  }

  /**
   * Create new admission application
   */
  async create(admission: AdmissionInsert) {
    const { data, error } = await supabase
      .from('admissions')
      .insert([admission])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update admission
   */
  async update(id: string, updates: AdmissionUpdate) {
    const { data, error } = await supabase
      .from('admissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Approve admission and create student record
   */
  async approve(id: string, approvedBy: string) {
    const { data: admission, error: fetchError } = await supabase
      .from('admissions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Update admission status
    const { error: updateError } = await supabase
      .from('admissions')
      .update({
        status: 'approved',
        approved_by: approvedBy,
        approved_at: toSupabaseTimestamp(new Date()),
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // Generate student ID
    const { count } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });

    const studentId = `COL2025-${String((count || 0) + 1).padStart(4, '0')}`;

    // Create student record from admission
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert([{
        student_id: studentId,
        name: admission.student_name,
        email: admission.email,
        phone: admission.phone,
        date_of_birth: admission.date_of_birth,
        gender: admission.gender,
        course: admission.course,
        semester: 1,
        cgpa: 0.00,
        status: 'Active',
        address: admission.address,
        guardian_name: admission.guardian_name,
        guardian_phone: admission.guardian_phone,
      }])
      .select()
      .single();

    if (studentError) throw studentError;

    return { admission, student };
  }

  /**
   * Reject admission
   */
  async reject(id: string, rejectedBy: string, reason?: string) {
    const { data, error } = await supabase
      .from('admissions')
      .update({
        status: 'rejected',
        approved_by: rejectedBy,
        approved_at: toSupabaseTimestamp(new Date()),
        rejection_reason: reason,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete admission
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('admissions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Search admissions
   */
  async search(query: string) {
    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get admissions count by status
   */
  async getCountByStatus() {
    const { data, error } = await supabase
      .from('admissions')
      .select('status');

    if (error) throw error;

    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: data.length,
    };

    data.forEach(admission => {
      if (admission.status === 'pending') counts.pending++;
      else if (admission.status === 'approved') counts.approved++;
      else if (admission.status === 'rejected') counts.rejected++;
    });

    return counts;
  }

  /**
   * Get admissions by date range
   */
  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

export const admissionService = new AdmissionService();
