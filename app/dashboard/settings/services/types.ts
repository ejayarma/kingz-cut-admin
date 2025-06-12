export interface Service {
  id: string;
  name: string;
  timeframe: number;
  price: number;
  imageUrl?: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export type IconName = "scissors" | "diamond" | "palette" | "spray-can";
export type ColorName = "blue" | "red" | "orange" | "purple" | "green" | "pink";