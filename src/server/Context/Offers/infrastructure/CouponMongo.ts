import { Schema } from "mongoose";
import { OfferModel } from "./OfferMongo";

export interface CouponMongo {
  _id: string;
  title: string;
  header: string;
  message: string;
  paymentProviderId: string;
  account: string;
}

const CouponSchema = new Schema<CouponMongo>({
  _id: { type: String },
  title: { type: String, required: true },
  header: { type: String },
  message: { type: String },
  paymentProviderId: { type: String },
  account: { type: String, ref: "Account" },
});

//TODO remove the Offer from the CouponOffer below
export const CouponModel = OfferModel.discriminator<CouponMongo>(
  "CouponOffer",
  CouponSchema,
);
