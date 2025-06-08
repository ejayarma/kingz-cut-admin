interface Service {
  id: string;
  name: string;
  timeframe: number;
  price: number;
  imageUrl?: string;
  createdAt?: string; // ISO string format
  updatedAt?: string; // ISO string format
}
