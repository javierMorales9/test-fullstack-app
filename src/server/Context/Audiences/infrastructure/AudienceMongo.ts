import { model, Schema } from "mongoose";

interface SegmentMongo {
  field: string;
  operator: string;
  value: string | number | Date | [number, number] | [Date, Date];
}

export interface AudienceMongo {
  _id: string;
  name: string;
  segments: SegmentMongo[];
  account: string;
}

const SegmentSchema = new Schema<SegmentMongo>({
  field: { type: String, required: true },
  operator: { type: String, required: true },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

const AudienceSchema = new Schema<AudienceMongo>({
  _id: { type: String },
  name: { type: String, required: true },
  segments: { type: [SegmentSchema] },
  account: { type: String, ref: "Account" },
});

export const AudienceModel = model<AudienceMongo>("Audience", AudienceSchema);
