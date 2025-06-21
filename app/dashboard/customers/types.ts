// types.ts
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  image?: string | null;
}
