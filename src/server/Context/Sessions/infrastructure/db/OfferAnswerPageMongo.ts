import { Schema } from 'mongoose';
import { answers } from './sessionMongo';

export type OfferAnswerPageMongo = {
  page: string;
  answer: boolean;
  data: OfferAnswerDataMongo;
};

export type OfferAnswerDataMongo =
  | PauseAnswerDataMongo
  | CouponAnswerDataMongo
  | CustomContentAnswerDataMongo;
export type PauseAnswerDataMongo = {
  offer: string;
  monthPaused: number;
};
export type CouponAnswerDataMongo = {
  offer: string;
};
export type CustomContentAnswerDataMongo = {
  offer: string;
  content: string;
};

const options = { discriminatorKey: 'type' };
const OfferAnswerDataSchema = new Schema<OfferAnswerDataMongo>({}, options);

const PauseAnswerDataSchema = new Schema<PauseAnswerDataMongo>({
  offer: { type: String, ref: 'Offer' },
  monthPaused: Number,
});
const CouponAnswerDataSchema = new Schema<CouponAnswerDataMongo>({
  offer: { type: String, ref: 'Offer' },
});
const CustomContentAnswerDataSchema = new Schema<CustomContentAnswerDataMongo>({
  offer: { type: String, ref: 'Offer' },
  content: String,
});

const OfferPageAnswerSchema = new Schema<OfferAnswerPageMongo>({
  page: { type: String, ref: 'Page' },
  answer: Boolean,
  data: { type: OfferAnswerDataSchema },
});

const data = OfferPageAnswerSchema.path<Schema.Types.Subdocument>('data');
export const PauseAnswerDataModel = data.discriminator(
  'pauseAnswerData',
  PauseAnswerDataSchema,
  'pause',
);
export const CouponAnswerDataModel = data.discriminator(
  'couponAnswerData',
  CouponAnswerDataSchema,
  'coupon',
);

export const CustomContentAnswerDataModel = data.discriminator(
  'customContentAnswerData',
  CustomContentAnswerDataSchema,
  'customcontent',
);

export const OfferPageAnswerModel = answers.discriminator(
  'offerPageAnswer',
  OfferPageAnswerSchema,
  'offerpage',
);
