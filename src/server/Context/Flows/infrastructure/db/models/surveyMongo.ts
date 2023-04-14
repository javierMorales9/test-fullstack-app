import { Schema } from 'mongoose';
import { PageModel } from './pageMongo';

export interface SurveyMongo {
  _id: string;
  title: string;
  hint: string;
  options: string[];
  order: number;
}

const SurveySchema = new Schema<SurveyMongo>({
  _id: { type: String },
  title: { type: String, required: true },
  hint: { type: String },
  options: { type: [String], required: true },
  order: { type: Number },
});

export const SurveyModel = PageModel.discriminator<SurveyMongo>(
  'Survey',
  SurveySchema,
);
