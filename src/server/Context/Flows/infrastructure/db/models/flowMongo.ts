import { Schema, model } from 'mongoose';
import { FlowDesign } from '../../../domain/FlowDesign';

export interface FlowMongo {
  _id: string;
  name: string;
  description: string;
  pages: string[];
  account: string;
  audiences: string[];
  activated: boolean;
  design: FlowDesign;
  createdAt: Date;
  updatedAt: Date;
  visualizations: number;
  boostedRevenue: number;
  paymentProvider: string;
}

const FlowDesignSchema = new Schema<FlowDesign>({
  buttonColor: String,
  buttonTextColor: String,
  acceptButtonTextColor: String,
  wrongAnswerButtonTextColor: String,
  mainTitleColor: String,
  descriptionTextColor: String,
  subtitleTextColor: String,
  surveyOptionsColor: String,
  surveyBoxColor: String,
  typography: String,
});

const FlowSchema = new Schema<FlowMongo>({
  _id: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  pages: { type: [String], ref: 'Page' },
  account: { type: String, ref: 'Account' },
  audiences: { type: [String], ref: 'Audience' },
  activated: { type: Boolean },
  design: { type: FlowDesignSchema },
  createdAt: Date,
  updatedAt: Date,
  visualizations: Number,
  boostedRevenue: Number,
  paymentProvider: String,
});

export const FlowModel = model<FlowMongo>('Flow', FlowSchema);
