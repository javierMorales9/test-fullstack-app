import { Offer } from './Offer';
import { CouponRequest } from './request/CouponRequest';

export class Coupon extends Offer {
  constructor(
    type: 'coupon',
    title: string,
    public header: string,
    message: string,
    public paymentProviderId: string,
    account: string,
    id?: string,
  ) {
    super(type, title, message, account, id);
  }

  public static fromOfferRequest(
    request: CouponRequest,
    account: string,
  ): Coupon {
    return new Coupon(
      request.type,
      request.title,
      request.header,
      request.message,
      request.paymentProviderId,
      account,
      request.id,
    );
  }
}
