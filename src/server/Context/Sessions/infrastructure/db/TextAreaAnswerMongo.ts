import { Schema } from 'mongoose';
import { SurveyAnswerMongo } from './SurveyAnswerMongo';
import { answers } from './sessionMongo';

export type TextAreaAnswerMongo = {
  page: string;
  answer: string;
};

const TextareaAnswerSchema = new Schema<SurveyAnswerMongo>({
  page: { type: String, ref: 'Page' },
  answer: { type: String },
});

export const TextareaAnswerModel = answers.discriminator(
  'textareaAnswer',
  TextareaAnswerSchema,
  'textarea',
);
