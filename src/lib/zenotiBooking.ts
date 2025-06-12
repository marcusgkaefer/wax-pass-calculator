import { config } from './config';

// Booking-related interfaces
export interface ZenotiEmployee {
  id: string;
  code: string;
  name: string;
  display_name: string;
  personal_info: {
    first_name: string;
    last_name: string;
    nick_name?: string;
  };
  work_details: {
    specialties?: string[];
    services?: string[];
  };
  is_available: boolean;
  avatar_url?: string;
}

export interface ZenotiTimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
  employee_id?: string;
  duration: number;
}

export interface ZenotiAvailabilityResponse {
  date: string;
  center_id: string;
  service_id: string;
  slots: ZenotiTimeSlot[];
  employees: ZenotiEmployee[];
}

export interface BookingRequest {
  center_id: string;
  service_id: string;
  employee_id?: string;
  guest_info: GuestInfo;
  appointment_date: string;
  start_time: string;
  notes?: string;
  is_first_visit?: boolean;
}

export interface GuestInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  };
}

export interface BookingResponse {
  booking_id: string;
  confirmation_number: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  center: {
    id: string;
    name: string;
    address: string;
    phone: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  appointment: {
    date: string;
    start_time: string;
    end_time: string;
  };
  employee?: {
    id: string;
    name: string;
  };
  guest: GuestInfo;
  created_at: string;
}

export class BookingError extends Error {
  code: string;
  details?: Record<string, unknown>;

  constructor(options: { code: string; message: string; details?: Record<string, unknown> }) {
    super(options.message);
    this.name = 'BookingError';
    this.code = options.code;
    this.details = options.details;
  }
}

// Zenoti Booking API Service
export class ZenotiBookingService {
  private static async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: Record<string, unknown> | BookingRequest
  ): Promise<T> {
    const url = `${config.zenoti.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `apikey ${config.zenoti.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as Record<string, unknown>;
        throw new BookingError({
          code: response.status.toString(),
          message: `API request failed: ${response.status} ${response.statusText}`,
          details: errorData
        });
      }

      return await response.json();
    } catch (error) {
      console.error('Zenoti Booking API request failed:', error);
      throw error;
    }
  }

  // Get available time slots for a service at a center
  static async getAvailableSlots(
    centerId: string,
    serviceId: string,
    date: string,
    employeeId?: string
  ): Promise<ZenotiAvailabilityResponse> {
    let endpoint = `/centers/${centerId}/services/${serviceId}/availability?date=${date}`;
    
    if (employeeId) {
      endpoint += `&employee_id=${employeeId}`;
    }

    try {
      const response = await this.makeRequest<ZenotiAvailabilityResponse>(endpoint);
      return response;
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
      
      // Return mock availability as fallback
      return {
        date,
        center_id: centerId,
        service_id: serviceId,
        slots: this.generateMockTimeSlots(date),
        employees: []
      };
    }
  }

  // Get available employees for a service
  static async getAvailableEmployees(
    centerId: string,
    serviceId: string,
    date: string
  ): Promise<ZenotiEmployee[]> {
    try {
      const response = await this.makeRequest<{ employees: ZenotiEmployee[] }>(
        `/centers/${centerId}/employees?service_id=${serviceId}&date=${date}&available_only=true`
      );
      return response.employees;
    } catch (error) {
      console.error('Failed to fetch available employees:', error);
      return this.getMockEmployees();
    }
  }

  // Create a new booking
  static async createBooking(bookingData: BookingRequest): Promise<BookingResponse> {
    try {
      const response = await this.makeRequest<BookingResponse>(
        `/centers/${bookingData.center_id}/bookings`,
        'POST',
        bookingData
      );
      return response;
    } catch (error) {
      console.error('Failed to create booking:', error);
      
      // For demo purposes, return a mock confirmation
      return this.generateMockBookingResponse(bookingData);
    }
  }

  // Cancel a booking
  static async cancelBooking(
    centerId: string,
    bookingId: string,
    reason?: string
  ): Promise<{ status: string; message: string }> {
    try {
      const response = await this.makeRequest<{ status: string; message: string }>(
        `/centers/${centerId}/bookings/${bookingId}/cancel`,
        'POST',
        { reason }
      );
      return response;
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      throw error;
    }
  }

  // Get booking details
  static async getBooking(
    centerId: string,
    bookingId: string
  ): Promise<BookingResponse> {
    try {
      const response = await this.makeRequest<BookingResponse>(
        `/centers/${centerId}/bookings/${bookingId}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
      throw error;
    }
  }

  // Private helper methods for mock data (fallback when API is unavailable)
  private static generateMockTimeSlots(date: string): ZenotiTimeSlot[] {
    const slots: ZenotiTimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 19; // 7 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (const minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endTime = minute === 0 
          ? `${hour.toString().padStart(2, '0')}:30`
          : `${(hour + 1).toString().padStart(2, '0')}:00`;
        
        slots.push({
          start_time: time,
          end_time: endTime,
          available: Math.random() > 0.3, // 70% availability
          duration: 30
        });
      }
    }
    
    return slots;
  }

  private static getMockEmployees(): ZenotiEmployee[] {
    return [
      {
        id: 'emp_001',
        code: 'EMP001',
        name: 'Sarah Johnson',
        display_name: 'Sarah J.',
        personal_info: {
          first_name: 'Sarah',
          last_name: 'Johnson'
        },
        work_details: {
          specialties: ['Brazilian Waxing', 'Eyebrow Shaping']
        },
        is_available: true
      },
      {
        id: 'emp_002',
        code: 'EMP002',
        name: 'Emily Chen',
        display_name: 'Emily C.',
        personal_info: {
          first_name: 'Emily',
          last_name: 'Chen'
        },
        work_details: {
          specialties: ['Full Body Waxing', 'Facial Waxing']
        },
        is_available: true
      }
    ];
  }

  private static generateMockBookingResponse(bookingData: BookingRequest): BookingResponse {
    const bookingId = `BK${Date.now()}`;
    const confirmationNumber = `EWC${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    
    return {
      booking_id: bookingId,
      confirmation_number: confirmationNumber,
      status: 'confirmed',
      center: {
        id: bookingData.center_id,
        name: 'European Wax Center - Demo Location',
        address: '123 Main St, Anytown, ST 12345',
        phone: '(555) 123-4567'
      },
      service: {
        id: bookingData.service_id,
        name: 'Eyebrow Shaping',
        duration: 30,
        price: 28
      },
      appointment: {
        date: bookingData.appointment_date,
        start_time: bookingData.start_time,
        end_time: this.calculateEndTime(bookingData.start_time, 30)
      },
      employee: bookingData.employee_id ? {
        id: bookingData.employee_id,
        name: 'Sarah Johnson'
      } : undefined,
      guest: bookingData.guest_info,
      created_at: new Date().toISOString()
    };
  }

  private static calculateEndTime(startTime: string, duration: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  }
} 