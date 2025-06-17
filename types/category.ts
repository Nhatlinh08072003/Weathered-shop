export interface Category {
  _id: string;
  name: string;
  collection: string;
  createdAt: Date;
  updatedAt?: Date;
}