// Define types for your staff management system

export interface StaffMember {
    id: string;
    name: string;
    phone: string;
    email: string;
    services: string[];
    image?: string;
  }
  
  export interface StaffFormValues {
    name: string;
    email: string;
    phone: string;
    services: string[];
  }