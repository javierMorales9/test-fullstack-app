import { Offer } from "../domain/Offer";
import { createOfferFromNonSchemaData } from "../domain/offerFactory";

export function transformToOfferFromRepo(entryOffer: any): Offer | null {
  if (entryOffer == null) return null;

  const mongoOffer = entryOffer._doc ? entryOffer._doc : entryOffer;

  mongoOffer.id = mongoOffer._id.toString();
  mongoOffer.type = mongoOffer.__type;

  return createOfferFromNonSchemaData(mongoOffer);
}

export function transformToArrayOfOffersFromRepo(entryOffers: any[]): Offer[] {
  const offers: Offer[] = [];

  for (const mongoOffer of entryOffers) {
    const offer = transformToOfferFromRepo(mongoOffer);

    if (offer != null) offers.push(offer);
  }

  return offers;
}
