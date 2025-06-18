import { supabase } from '@/integrations/supabase/client';

export interface ReservationData {
  reservationDate: string; // YYYY-MM-DD format
  reservationTime: string; // HH:MM format
  guests: number;
  seatingArea: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specialRequests?: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  seating_area: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

// Check availability for a specific date, time, and guest count
export const checkAvailability = async (
  date: string,
  time: string,
  guests: number,
  seatingArea: string
): Promise<{ available: boolean; message?: string }> => {
  try {
    // Check existing reservations for the same date, time, and seating area
    const { data: existingReservations, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('reservation_date', date)
      .eq('reservation_time', time)
      .eq('seating_area', seatingArea)
      .in('status', ['pending', 'confirmed']);

    if (error) {
      console.error('Error checking availability:', error);
      return { available: false, message: 'Error checking availability' };
    }

    // Simple availability logic - for now, allow up to 3 reservations per time slot per area
    const maxReservationsPerSlot = 3;
    const currentReservations = existingReservations?.length || 0;

    if (currentReservations >= maxReservationsPerSlot) {
      return { 
        available: false, 
        message: 'This time slot is fully booked. Please choose another time.' 
      };
    }

    // Check if the requested guest count would exceed capacity
    const totalGuests = existingReservations?.reduce((sum, res) => sum + res.guests, 0) || 0;
    const maxCapacityPerArea = 30; // Assume each area can handle 30 guests max
    
    if (totalGuests + guests > maxCapacityPerArea) {
      return { 
        available: false, 
        message: 'Not enough capacity for this group size at this time. Please choose another time or reduce party size.' 
      };
    }

    return { available: true };
  } catch (error) {
    console.error('Availability check error:', error);
    return { available: false, message: 'Error checking availability' };
  }
};

// Create a new reservation
export const createReservation = async (
  reservationData: ReservationData
): Promise<{ success: boolean; reservationId?: string; error?: string }> => {
  try {
    // Get current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return { success: false, error: 'Authentication error. Please sign in again.' };
    }
    
    if (!session?.user?.id) {
      return { success: false, error: 'You must be logged in to make a reservation' };
    }

    const userId = session.user.id;

    // Check availability first
    const availability = await checkAvailability(
      reservationData.reservationDate,
      reservationData.reservationTime,
      reservationData.guests,
      reservationData.seatingArea
    );

    if (!availability.available) {
      return { success: false, error: availability.message || 'Time slot not available' };
    }

    // Create the reservation
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        user_id: userId,
        reservation_date: reservationData.reservationDate,
        reservation_time: reservationData.reservationTime,
        guests: reservationData.guests,
        seating_area: reservationData.seatingArea,
        customer_name: reservationData.customerName,
        customer_phone: reservationData.customerPhone,
        customer_email: reservationData.customerEmail,
        special_requests: reservationData.specialRequests || null,
        status: 'pending'
      })
      .select()
      .single();

    if (reservationError) {
      console.error('Reservation creation error:', reservationError);
      return { 
        success: false, 
        error: `Failed to create reservation: ${reservationError.message || 'Unknown error'}` 
      };
    }

    return { success: true, reservationId: reservation.id };

  } catch (error) {
    console.error('Reservation creation error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred while creating your reservation' 
    };
  }
};

// Get user's reservations
export const getUserReservations = async (): Promise<Reservation[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      return [];
    }

    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', session.user.id)
      .order('reservation_date', { ascending: false })
      .order('reservation_time', { ascending: false });

    if (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }

    return reservations || [];
  } catch (error) {
    console.error('Get user reservations error:', error);
    return [];
  }
};

// Cancel a reservation
export const cancelReservation = async (reservationId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      return { success: false, error: 'You must be logged in to cancel a reservation' };
    }

    const { error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservationId)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Reservation cancellation error:', error);
      return { success: false, error: 'Failed to cancel reservation' };
    }

    return { success: true };
  } catch (error) {
    console.error('Cancel reservation error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

// Get available time slots for a specific date
export const getAvailableTimeSlots = async (
  date: string,
  guests: number,
  seatingArea: string
): Promise<string[]> => {
  try {
    const allTimeSlots = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
      "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
      "18:00", "18:30", "19:00", "19:30"
    ];

    const availableSlots: string[] = [];

    for (const timeSlot of allTimeSlots) {
      const availability = await checkAvailability(date, timeSlot, guests, seatingArea);
      if (availability.available) {
        availableSlots.push(timeSlot);
      }
    }

    return availableSlots;
  } catch (error) {
    console.error('Error getting available time slots:', error);
    return [];
  }
}; 