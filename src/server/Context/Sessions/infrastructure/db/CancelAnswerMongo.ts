import { Schema, Types } from 'mongoose';
import { answers } from './sessionMongo';

export type CancelAnswerMongo = {
  page: string;
  answer: boolean;
};

const CancelAnswerSchema = new Schema<CancelAnswerMongo>({
  page: { type: String, ref: 'Page' },
  answer: Boolean,
});

export const CancelAnswerModel = answers.discriminator(
  'cancelAnswer',
  CancelAnswerSchema,
  'cancel',
);
