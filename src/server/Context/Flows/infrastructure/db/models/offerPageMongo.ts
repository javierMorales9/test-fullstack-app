import { Schema, Types } from "mongoose";
import { PageModel } from "./pageMongo";

interface SurveyMapMongo {
  survey: string;
  possibleAnswers: string[];
}

interface MapMongo {
  surveys: SurveyMapMongo[];
  audiences: string[];
  offer: string;
}

export interface OfferPageMongo {
  _id: string;
  maps: MapMongo[];
  order: number;
}

const SurveyMapSchema = new Schema<SurveyMapMongo>({
  survey: { type: String },
  possibleAnswers: { type: [String], required: true },
});

const MapSchema = new Schema<MapMongo>({
  surveys: { type: [SurveyMapSchema] },
  audiences: { type: [String] },
  offer: { type: String, ref: "Offer" },
});

const OfferPageSchema = new Schema<OfferPageMongo>({
  _id: { type: String },
  maps: { type: [MapSchema] },
  order: { type: Number },
});

export const OfferPageModel = PageModel.discriminator<OfferPageMongo>(
  "offerpage",
  OfferPageSchema,
);
