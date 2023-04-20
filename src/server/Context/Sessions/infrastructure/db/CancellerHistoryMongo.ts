import { model, Schema } from "mongoose";

interface SessionDataMongo {
  session: string;
  ticket: number;
  cancellationReason: string;
  state: string;
  date: Date;
}

export interface CancellerHistoryMongo {
  _id: string;
  cancellerId: string;
  sessionResults: SessionDataMongo[];
  state: string;
  ticket: number;
  cancellationReason: string;
  account: string;
  isResaved: boolean;
  boostedRevenue: number;
}

const SessionDataSchema = new Schema<SessionDataMongo>({
  session: { type: String, ref: "Session" },
  ticket: Number,
  cancellationReason: String,
  state: String,
  date: Date,
});

const CancellerHistorySchema = new Schema<CancellerHistoryMongo>({
  _id: { type: String },
  cancellerId: { type: String, required: true, unique: true },
  sessionResults: { type: [SessionDataSchema] },
  state: String,
  ticket: Number,
  cancellationReason: String,
  account: { type: String, ref: "Account" },
  isResaved: Boolean,
  boostedRevenue: Number,
});

export const CancellerHistoryModel = model<CancellerHistoryMongo>(
  "CancellerHistory",
  CancellerHistorySchema,
);
