import { Uuid } from "../../../../Context/Shared/domain/value-object/Uuid";

export default class OfferCouldNotBeCreatedError extends Error {
  constructor(offerId: Uuid) {
    super(`Offer with id ${offerId.value} could not be created`);
  }
}
