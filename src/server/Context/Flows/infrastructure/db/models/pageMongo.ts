import { Schema, model } from 'mongoose';
import { SurveyMongo } from './surveyMongo';
import { OfferPageMongo } from './offerPageMongo';
import { CancelMongo } from './cancelMongo';

type PageMongo = SurveyMongo | OfferPageMongo | CancelMongo;

const baseOptions = {
  discriminatorKey: '__type',
};

const PageSchema = new Schema<PageMongo>(
  {
    _id: { type: String },
  },
  baseOptions,
);

export const PageModel = model<PageMongo>('Page', PageSchema);
