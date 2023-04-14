import { Schema, model } from 'mongoose';
import { AnswerMongo, AnswerSchema } from './AnswerMongo';

interface UserDataMongo {
  userId: string;
  plan: string;
  subscriptionPrice: number;
  billingInterval: string;
  subscriptionAge: number;
  subscriptionStartDate: Date;
  subscriptionStatus: string;
}

export interface SessionMongo {
  _id: string;
  flow: string;
  subscription: string;
  user: string;
  token: string;
  userData: UserDataMongo;
  finished: boolean;
  answers: AnswerMongo[];
  createdAt: Date;
  updatedAt: Date;
  preview: boolean;
}

export const UserDataSchema = new Schema<UserDataMongo>({
  userId: { type: String, required: true },
  plan: { type: String, required: true },
  subscriptionPrice: { type: Number, required: true },
  billingInterval: { type: String, required: true },
  subscriptionAge: { type: Number, required: true },
  subscriptionStartDate: { type: Date },
  subscriptionStatus: { type: String, required: true },
});

export const SessionSchema = new Schema<SessionMongo>({
  _id: { type: String },
  flow: { type: String, ref: 'Flow' },
  subscription: { type: String },
  user: { type: String },
  token: { type: String, unique: true },
  userData: { type: UserDataSchema },
  finished: { type: Boolean },
  answers: { type: [AnswerSchema] },
  createdAt: Date,
  updatedAt: Date,
  preview: Boolean,
});

export const SessionModel = model<SessionMongo>('Session', SessionSchema);
export const answers = SessionSchema.path<Schema.Types.Subdocument>('answers');
