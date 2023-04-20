import { OfferRepository } from "../OfferRepository";
import { Uuid } from "../../../../Context/Shared/domain/value-object/Uuid";

export default class DeleteAllOffersService {
  constructor(private offerRepo: OfferRepository) {}

  async execute(accountId: Uuid) {
    await this.offerRepo.deleteAll(accountId.value);
  }
}
