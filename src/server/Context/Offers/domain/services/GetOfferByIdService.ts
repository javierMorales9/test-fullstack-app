import { OfferRepository } from '../OfferRepository';
import OfferNotFoundError from '../erorrs/OfferNotFoundError';

export default class GetOfferByIdService {
  constructor(private offerRepo: OfferRepository) {}

  async execute(offerId: string) {
    const offer = await this.offerRepo.getOfferById(offerId);
    if (!offer) throw new OfferNotFoundError();

    return offer;
  }
}
