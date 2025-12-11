import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Fee = Database['public']['Tables']['fees']['Row'];
type FeeInsert = Database['public']['Tables']['fees']['Insert'];
type FeeUpdate = Database['public']['Tables']['fees']['Update'];

type FeePayment = Database['public']['Tables']['fee_payments']['Row'];
type FeePaymentInsert = Database['public']['Tables']['fee_payments']['Insert'];

export class FeeService {
  /**
   * Get all fees
   */
  async getAll() {
    const { data, error } = await supabase
      .from('fees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get fee by ID
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('fees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get fees by student ID
   */
  async getByStudentId(studentId: string) {
    const { data, error } = await supabase
      .from('fees')
      .select('*')
      .eq('student_id', studentId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Get pending fees for a student
   */
  async getPendingByStudentId(studentId: string) {
    const { data, error } = await supabase
      .from('fees')
      .select('*')
      .eq('student_id', studentId)
      .eq('status', 'pending')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Get overdue fees
   */
  async getOverdue() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('fees')
      .select('*')
      .eq('status', 'pending')
      .lt('due_date', today)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Create new fee record
   */
  async create(fee: FeeInsert) {
    const { data, error } = await supabase
      .from('fees')
      .insert([fee])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update fee
   */
  async update(id: string, updates: FeeUpdate) {
    const { data, error } = await supabase
      .from('fees')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Mark fee as paid
   */
  async markAsPaid(id: string, paymentId: string) {
    const { data, error } = await supabase
      .from('fees')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete fee
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('fees')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Get total pending amount for student
   */
  async getTotalPending(studentId: string) {
    const { data, error } = await supabase
      .from('fees')
      .select('amount')
      .eq('student_id', studentId)
      .eq('status', 'pending');

    if (error) throw error;

    return data.reduce((total, fee) => total + (fee.amount || 0), 0);
  }

  /**
   * Get fee payments
   */
  async getPayments(studentId?: string) {
    let query = supabase
      .from('fee_payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * Create fee payment record
   */
  async createPayment(payment: FeePaymentInsert) {
    const { data, error } = await supabase
      .from('fee_payments')
      .insert([payment])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(id: string) {
    const { data, error } = await supabase
      .from('fee_payments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get payment by Razorpay order ID
   */
  async getPaymentByOrderId(orderId: string) {
    const { data, error } = await supabase
      .from('fee_payments')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(id: string, status: 'pending' | 'success' | 'failed', razorpayPaymentId?: string) {
    const updates: any = { status };
    if (razorpayPaymentId) {
      updates.razorpay_payment_id = razorpayPaymentId;
    }

    const { data, error } = await supabase
      .from('fee_payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get fee statistics
   */
  async getStats() {
    const { data: allFees, error: feesError } = await supabase
      .from('fees')
      .select('amount, status');

    if (feesError) throw feesError;

    const { data: payments, error: paymentsError } = await supabase
      .from('fee_payments')
      .select('amount, status');

    if (paymentsError) throw paymentsError;

    const stats = {
      totalDue: 0,
      totalPaid: 0,
      totalPending: 0,
      totalOverdue: 0,
      paymentCount: payments.length,
      pendingCount: 0,
    };

    allFees.forEach(fee => {
      if (fee.status === 'pending') {
        stats.totalPending += fee.amount || 0;
        stats.pendingCount++;
      } else if (fee.status === 'paid') {
        stats.totalPaid += fee.amount || 0;
      }
    });

    stats.totalDue = stats.totalPending + stats.totalPaid;

    return stats;
  }
}

export const feeService = new FeeService();
