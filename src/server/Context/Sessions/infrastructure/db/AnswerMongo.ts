import { SurveyAnswerMongo } from './SurveyAnswerMongo';
import { Schema } from 'mongoose';
import { OfferAnswerPageMongo } from './OfferAnswerPageMongo';
import { CancelAnswerMongo } from './CancelAnswerMongo';
import { TextAreaAnswerMongo } from './TextAreaAnswerMongo';

export type AnswerMongo =
  | SurveyAnswerMongo
  | OfferAnswerPageMongo
  | CancelAnswerMongo
  | TextAreaAnswerMongo;

const options = { discriminatorKey: 'type' };
export const AnswerSchema = new Schema<AnswerMongo>({}, options);
