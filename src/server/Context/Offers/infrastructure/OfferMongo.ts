import { model, Schema, Types } from 'mongoose';
import { CouponMongo } from './CouponMongo';
import { PauseMongo } from './PauseMongo';

export type OfferMongo =
  | PauseMongo
  | (CouponMongo & {
      _id: string;
      account: string;
    });

const baseOptions = {
  discriminatorKey: '__type',
};

const OfferSchema = new Schema<OfferMongo>(
  {
    _id: { type: String },
    account: { type: String, ref: 'Account' },
  },
  baseOptions,
);

export const OfferModel = model<OfferMongo>('Offer', OfferSchema);
