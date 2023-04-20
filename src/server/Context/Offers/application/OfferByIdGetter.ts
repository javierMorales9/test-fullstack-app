import { OfferRepository } from "../domain/OfferRepository";
import { Offer } from "../domain/Offer";
import { Uuid } from "../../../Context/Shared/domain/value-object/Uuid";
import OfferNotFoundError from "../domain/erorrs/OfferNotFoundError";

export default class OfferByIdGetter {
  constructor(private offerRepo: OfferRepository) {}

  async execute(offerId: string, accountId?: Uuid): Promise<Offer> {
    const offer = await this.offerRepo.getOfferById(offerId);

    if (!offer || (accountId && !offer.account.equals(accountId)))
      throw new OfferNotFoundError();

    return offer;
  }
}
