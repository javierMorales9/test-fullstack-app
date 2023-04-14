import { Offer } from './Offer';

export interface OfferRepository {
  getAllFromAccount(accountId: string): Promise<Offer[]>;
  getOfferById(id: string): Promise<Offer | null>;
  saveOffer: (offer: Offer) => Promise<Offer | null>;
  delete: (offerId: string, accountId: string) => Promise<void>;
  deleteAll: (accountId: string) => Promise<void>;
}
