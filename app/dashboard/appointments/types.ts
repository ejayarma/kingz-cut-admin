// types/appointment.ts

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  isActive: boolean;
}

export interface Appointment {
  id: string | null;
  no?: number; // For display purposes
  customerId: string;
  customerName?: string; // Populated from customer data
  staffId: string;
  staffName?: string; // Populated from staff data
  serviceIds: string[];
  services?: Service[]; // Populated from services data
  startTime: string; // ISO string
  endTime: string; // ISO string
  date?: string; // Extracted from startTime (YYYY-MM-DD)
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'noShow';
  totalPrice: number;
  totalTimeframe: number; // in minutes
  bookingType: 'homeService' | 'walkInService';
  notes: string | null;
  reviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

// For the data table
export interface AppointmentTableRow extends Appointment {
  customerName: string;
  staffName: string;
  services: Service[];
}