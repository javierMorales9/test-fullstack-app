import { OfferRepository } from '../domain/OfferRepository';
import { Offer } from '../domain/Offer';
import { Uuid } from '../../../Context/Shared/domain/value-object/Uuid';

export default class AllOfferGetter {
  constructor(private offerRepo: OfferRepository) {}

  async execute(accountId: Uuid): Promise<Offer[]> {
    return await this.offerRepo.getAllFromAccount(accountId.value);
  }
}
