import { Schema, Types } from 'mongoose';
import { answers } from './sessionMongo';

export type SurveyAnswerMongo = {
  page: string;
  answer: string;
};

const SurveyAnswerSchema = new Schema<SurveyAnswerMongo>({
  page: { type: String, ref: 'Page' },
  answer: { type: String },
});

export const SurveyAnswerModel = answers.discriminator(
  'surveyAnswer',
  SurveyAnswerSchema,
  'survey',
);
