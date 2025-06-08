export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  image?: string;
  // url?: string;
  userId?: string; // Reference to the user account
  active: boolean;
  role: "staff" | "admin";
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// export interface Service {
//   id: string;
//   name: string;
//   description?: string;
//   active: boolean;
//   createdAt: string;
//   updatedAt: string;
// }
