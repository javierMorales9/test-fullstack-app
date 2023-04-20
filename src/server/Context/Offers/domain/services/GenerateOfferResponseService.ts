import OfferByIdGetter from "../../application/OfferByIdGetter";
import { createOfferResponse } from "../response/OfferResponse";

export default class GenerateOfferResponseService {
  constructor(private offerGetter: OfferByIdGetter) {}

  async execute(offerId: string) {
    const offer = await this.offerGetter.execute(offerId);
    return createOfferResponse(offer);
  }
}
