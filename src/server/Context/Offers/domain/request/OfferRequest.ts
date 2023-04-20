import { PauseRequest } from "./PauseRequest";
import { CouponRequest } from "./CouponRequest";
import { CustomContentRequest } from "./CustomContentRequest";

export type OfferRequest = PauseRequest | CouponRequest | CustomContentRequest;

export function createOfferRequest(data: any): OfferRequest {
  if (!data.type) throw new Error("Bad offer");

  switch (data.type) {
    case "pause":
      return new PauseRequest(data);
    case "coupon":
      return new CouponRequest(data);
    case "customcontent":
      data.type = "customcontent";
      return new CustomContentRequest(data);
    case "PauseOffer":
      data.type = "pause";
      return new PauseRequest(data);
    case "CouponOffer":
      data.type = "coupon";
      return new CouponRequest(data);
    case "CustomContentOffer":
      data.type = "customcontent";
      return new CustomContentRequest(data);
    default:
      throw new Error("Incorrect data type: " + data.type);
  }
}
