import { Schema } from "mongoose";
import { OfferModel } from "./OfferMongo";

export interface CustomContentMongo {
  _id: string;
  title: string;
  content: string;
  account: string;
}

const CustomContentSchema = new Schema<CustomContentMongo>({
  _id: { type: String },
  title: { type: String, required: true },
  content: { type: String, required: true },
  account: { type: String, ref: "Account" },
});

export const CustomContentModel = OfferModel.discriminator<CustomContentMongo>(
  "CustomContentOffer",
  CustomContentSchema,
);
