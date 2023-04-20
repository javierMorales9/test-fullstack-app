import { OfferRepository } from "../domain/OfferRepository";
import { Offer } from "../domain/Offer";
import { OfferRequest } from "../domain/request/OfferRequest";
import { createOfferFromRequest } from "../domain/offerFactory";
import { Uuid } from "../../../Context/Shared/domain/value-object/Uuid";

export default class OfferSaver {
  constructor(private offerRepo: OfferRepository) {}

  async execute(offerRequest: OfferRequest, accountId: Uuid): Promise<Offer> {
    const offer = createOfferFromRequest(offerRequest, accountId.value);
    const offerSaved = await this.offerRepo.saveOffer(offer);

    if (!offerSaved) throw new Error("Couldn't create the offer");

    return offerSaved;
  }
}
