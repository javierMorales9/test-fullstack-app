import { OfferPage } from '../OfferPage';
import { View } from './View';
import { OfferResponse } from '../../../../Offers/domain/response/OfferResponse';

export class OfferPageView extends View {
  public offerInfo: OfferResponse;

  constructor(offerPage: OfferPage, offerResponse: OfferResponse) {
    super(offerPage.id, offerPage.type);

    this.offerInfo = offerResponse;
  }
}
