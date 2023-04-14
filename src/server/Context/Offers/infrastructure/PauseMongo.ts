import { Schema } from 'mongoose';
import { OfferModel } from './OfferMongo';

export interface PauseMongo {
  _id: string;
  title: string;
  message: string;
  maxPauseMonth: number;
  account: string;
}

const PauseSchema = new Schema<PauseMongo>({
  _id: { type: String },
  title: { type: String, required: true },
  message: { type: String, required: true },
  maxPauseMonth: { type: Number },
  account: { type: String, ref: 'Account' },
});

//TODO remove the Offer from the PauseOffer below
export const PauseModel = OfferModel.discriminator<PauseMongo>(
  'PauseOffer',
  PauseSchema,
);
