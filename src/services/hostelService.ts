import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type HostelRoom = Database['public']['Tables']['hostel_rooms']['Row'];
type HostelRoomInsert = Database['public']['Tables']['hostel_rooms']['Insert'];
type HostelRoomUpdate = Database['public']['Tables']['hostel_rooms']['Update'];

type HostelAllocation = Database['public']['Tables']['hostel_allocations']['Row'];
type HostelAllocationInsert = Database['public']['Tables']['hostel_allocations']['Insert'];
type HostelAllocationUpdate = Database['public']['Tables']['hostel_allocations']['Update'];

export class HostelService {
  /**
   * Get all hostel rooms
   */
  async getAllRooms() {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .select('*')
      .order('room_number');

    if (error) throw error;
    return data;
  }

  /**
   * Get room by ID
   */
  async getRoomById(id: string) {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get available rooms
   */
  async getAvailableRooms(hostelType?: 'boys' | 'girls') {
    let query = supabase
      .from('hostel_rooms')
      .select('*')
      .eq('status', 'available')
      .order('room_number');

    if (hostelType) {
      query = query.eq('hostel_type', hostelType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * Get occupied rooms
   */
  async getOccupiedRooms() {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .select('*')
      .eq('status', 'Occupied')
      .order('room_number');

    if (error) throw error;
    return data;
  }

  /**
   * Create new hostel room
   */
  async createRoom(room: HostelRoomInsert) {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .insert([room])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update hostel room
   */
  async updateRoom(id: string, updates: HostelRoomUpdate) {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete hostel room
   */
  async deleteRoom(id: string) {
    const { error } = await supabase
      .from('hostel_rooms')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Get all hostel allocations
   */
  async getAllAllocations() {
    const { data, error } = await supabase
      .from('hostel_allocations')
      .select(`
        *,
        students (
          student_id,
          name,
          email,
          phone,
          course
        ),
        hostel_rooms (
          room_number,
          hostel_type,
          floor
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get allocation by ID
   */
  async getAllocationById(id: string) {
    const { data, error } = await supabase
      .from('hostel_allocations')
      .select(`
        *,
        students (
          student_id,
          name,
          email,
          phone,
          course
        ),
        hostel_rooms (
          room_number,
          hostel_type,
          floor,
          capacity
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get allocations by student ID
   */
  async getAllocationsByStudentId(studentId: string) {
    const { data, error } = await supabase
      .from('hostel_allocations')
      .select(`
        *,
        hostel_rooms (
          room_number,
          hostel_type,
          floor
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get active allocation for student
   */
  async getActiveAllocation(studentId: string) {
    const { data, error } = await supabase
      .from('hostel_allocations')
      .select(`
        *,
        hostel_rooms (
          room_number,
          hostel_type,
          floor
        )
      `)
      .eq('student_id', studentId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  }

  /**
   * Get allocations by room ID
   */
  async getAllocationsByRoomId(roomId: string) {
    const { data, error } = await supabase
      .from('hostel_allocations')
      .select(`
        *,
        students (
          student_id,
          name,
          email,
          phone
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Allocate room to student
   */
  async allocateRoom(allocation: HostelAllocationInsert) {
    // Check if room is available
    const { data: room, error: roomError } = await supabase
      .from('hostel_rooms')
      .select('*')
      .eq('id', allocation.room_id)
      .single();

    if (roomError) throw roomError;

    if (room.status !== 'available') {
      throw new Error('Room is not available for allocation');
    }

    // Create allocation
    const { data, error } = await supabase
      .from('hostel_allocations')
      .insert([allocation])
      .select()
      .single();

    if (error) throw error;

    // Update room status to occupied
    await this.updateRoom(allocation.room_id, {
      status: 'Occupied' as const
    });

    return data;
  }

  /**
   * Deallocate room (checkout)
   */
  async deallocateRoom(allocationId: string) {
    // Get allocation details
    const { data: allocation, error: allocError } = await supabase
      .from('hostel_allocations')
      .select('*, hostel_rooms(*)')
      .eq('id', allocationId)
      .single();

    if (allocError) throw allocError;

    // Update allocation status
    const { data, error } = await supabase
      .from('hostel_allocations')
      .update({
        status: 'vacated',
        check_out_date: new Date().toISOString(),
      })
      .eq('id', allocationId)
      .select()
      .single();

    if (error) throw error;

    // Update room status
    await this.updateRoom(allocation.room_id, {
      status: 'Available' as const
    });

    return data;
  }

  /**
   * Get hostel statistics
   */
  async getStats() {
    const { data: rooms, error: roomsError } = await supabase
      .from('hostel_rooms')
      .select('capacity, current_occupancy, status, hostel_type');

    if (roomsError) throw roomsError;

    const { data: allocations, error: allocError } = await supabase
      .from('hostel_allocations')
      .select('status');

    if (allocError) throw allocError;

    const stats = {
      totalRooms: rooms.length,
      availableRooms: 0,
      occupiedRooms: 0,
      totalCapacity: 0,
      currentOccupancy: 0,
      boysRooms: 0,
      girlsRooms: 0,
      activeAllocations: 0,
      vacatedAllocations: 0,
    };

    rooms.forEach(room => {
      stats.totalCapacity += room.capacity || 0;
      stats.currentOccupancy += room.current_occupancy || 0;
      
      if (room.status === 'Available') stats.availableRooms++;
      if (room.status === 'Occupied') stats.occupiedRooms++;
      
      if (room.hostel_type === 'boys') stats.boysRooms++;
      if (room.hostel_type === 'girls') stats.girlsRooms++;
    });

    allocations.forEach(allocation => {
      if (allocation.status === 'active') stats.activeAllocations++;
      if (allocation.status === 'vacated') stats.vacatedAllocations++;
    });

    return stats;
  }

  /**
   * Search rooms
   */
  async searchRooms(query: string) {
    const { data, error } = await supabase
      .from('hostel_rooms')
      .select('*')
      .or(`room_number.ilike.%${query}%,hostel_type.ilike.%${query}%`)
      .order('room_number');

    if (error) throw error;
    return data;
  }
}

export const hostelService = new HostelService();
