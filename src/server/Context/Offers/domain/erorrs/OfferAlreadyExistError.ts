import { Uuid } from "../../../../Context/Shared/domain/value-object/Uuid";

export default class OfferAlreadyExistError extends Error {
  constructor(offerId: Uuid) {
    super(`Offer with id ${offerId.value} already exists`);
  }
}
