import { OfferRepository } from "../OfferRepository";
import { Uuid } from "../../../../Context/Shared/domain/value-object/Uuid";

export default class DeleteOfferService {
  constructor(private offerRepo: OfferRepository) {}

  async execute(offerId: string, account: Uuid) {
    await this.offerRepo.delete(offerId, account.value);
  }
}
