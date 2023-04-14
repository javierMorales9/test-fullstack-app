import { OfferRepository } from '../domain/OfferRepository';
import { Offer } from '../domain/Offer';
import { PauseModel } from './PauseMongo';
import { CouponModel } from './CouponMongo';
import {
  transformToArrayOfOffersFromRepo,
  transformToOfferFromRepo,
} from './transformToOfferFromRepo';
import { OfferModel } from './OfferMongo';
import { CustomContentModel } from './CustomContentMongo';
import logger from '../../../Context/Shared/infrastructure/logger/logger';
import OfferCouldNotBeCreatedError from '../domain/erorrs/OfferCouldNotBeCreatedError';

export default class MongoOfferRepository implements OfferRepository {
  async getAllFromAccount(accountId: string): Promise<Offer[]> {
    const offers = await OfferModel.find({ account: accountId });
    return transformToArrayOfOffersFromRepo(offers);
  }

  async getOfferById(id: string): Promise<Offer | null> {
    const offer = await OfferModel.findById(id);
    return transformToOfferFromRepo(offer);
  }

  async saveOffer(offer: Offer): Promise<Offer | null> {
    logger.debug(
      'Started creating the offer of type: ' +
        offer.type +
        ' for the account ' +
        offer.account.value,
    );
    try {
      let savedOffer: any = null;
      const offerMongo = MongoOfferRepository.createOfferMongo(offer);

      console.log(offerMongo);
      if (offer.type === 'pause')
        savedOffer = await PauseModel.findOneAndUpdate(
          { _id: offerMongo._id },
          { $set: { ...offerMongo } },
          { upsert: true, new: true },
        );

      if (offer.type === 'coupon')
        savedOffer = await CouponModel.findOneAndUpdate(
          { _id: offerMongo._id },
          { $set: { ...offerMongo } },
          { upsert: true, new: true },
        );
      if (offer.type === 'customcontent')
        savedOffer = await CustomContentModel.findOneAndUpdate(
          { _id: offerMongo._id },
          { $set: { ...offerMongo } },
          { upsert: true, new: true },
        );

      logger.debug('Finished saving the offer request the db');
      return transformToOfferFromRepo(savedOffer);
    } catch (err: any) {
      logger.debug('Error creating the offer: ' + err.message);
      MongoOfferRepository.handleOfferCreationError(err, offer);
      throw err;
    }
  }

  public async delete(offerId: string, accountId: string): Promise<void> {
    logger.info('Deleting the offer ' + offerId + ' from mongo');

    try {
      await OfferModel.deleteOne(
        { _id: offerId, account: accountId },
        { upsert: true, new: true },
      );
    } catch (err) {
      logger.info('Error deleting the offer ' + offerId);
      throw new Error('Could not delete the offer');
    }
  }

  public async deleteAll(accountId: string): Promise<void> {
    logger.debug('Delete all the offers of the account: ' + accountId);

    try {
      await OfferModel.deleteMany(
        { account: accountId },
        { upsert: true, new: true },
      );
    } catch (err: any) {
      logger.debug('Error deleting the offers ' + err.message);
      throw new Error('Could not delete the offers from ' + accountId);
    }
  }

  private static createOfferMongo(offer: Offer) {
    const { id, account, ...rest } = offer;

    return {
      _id: id,
      ...rest,
      account: account.value,
    };
  }

  private static handleOfferCreationError(err: any, offer: Offer) {
    const errMessage = err.message as string;

    logger.debug('Error while creating the offer: ' + err.message);

    if (errMessage.includes('duplicate key error'))
      throw new OfferCouldNotBeCreatedError(offer.id);

    throw new OfferCouldNotBeCreatedError(offer.id);
  }
}
