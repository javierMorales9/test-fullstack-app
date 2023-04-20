import { PauseResponse } from "./PauseResponse";
import { CouponResponse } from "./CouponResponse";
import { Pause } from "../Pause";
import { Coupon } from "../Coupon";
import { Offer } from "../Offer";
import { CustomContent } from "../CustomContent";
import { CustomContentResponse } from "./CustomContentResponse";

export type OfferResponse =
  | PauseResponse
  | CouponResponse
  | CustomContentResponse;

export function createOfferResponse(offer: Offer): OfferResponse {
  switch (offer.type) {
    case "pause":
      return new PauseResponse(offer as Pause);
    case "coupon":
      return new CouponResponse(offer as Coupon);
    case "customcontent":
      return new CustomContentResponse(offer as CustomContent);
    default:
      throw new Error();
  }
}
