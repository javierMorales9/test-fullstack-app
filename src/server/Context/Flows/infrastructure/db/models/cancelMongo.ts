import { Schema } from 'mongoose';
import { PageModel } from './pageMongo';

export interface CancelMongo {
  _id: string;
  title: string;
  message: string;
  order: number;
}

const CancelSchema = new Schema<CancelMongo>({
  _id: { type: String },
  title: { type: String, required: true },
  message: { type: String, required: true },
  order: { type: Number },
});

export const CancelModel = PageModel.discriminator<CancelMongo>(
  'Cancel',
  CancelSchema,
);
