export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  size: string;
  createdAt: Date;
  updatedAt?: Date;
  description?: string;
  collection?: string;
  discount?: number | null;
  images?: string[]; // Add images array
}