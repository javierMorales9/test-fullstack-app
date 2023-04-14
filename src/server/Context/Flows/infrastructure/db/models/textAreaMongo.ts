import { Schema } from 'mongoose';
import { PageModel } from './pageMongo';

export interface TextAreaMongo {
  _id: string;
  type: string;
  order: number;
  title: string;
  description: string;
  id: string;
}

const TextAreaSchema = new Schema<TextAreaMongo>({
  _id: { type: String },
  type: { type: String, required: true },
  order: { type: Number },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

export const TextAreaModel = PageModel.discriminator(
  'textarea',
  TextAreaSchema,
);
