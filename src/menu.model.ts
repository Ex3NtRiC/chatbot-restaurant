import { Schema, Document } from 'mongoose';

export const MenuSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  keywords: [
    {
      type: String,
    },
  ],
});

export interface Menu extends Document {
  name: string;
  category: Category;
  description: string;
  price: number;
  keywords: string[];
}

export enum Category {
  C_Drink = 'Drinks',
  C_Main = 'Main Course',
  C_Dessert = 'Dessert',
}
