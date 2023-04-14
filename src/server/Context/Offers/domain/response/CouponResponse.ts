import { Coupon } from '../Coupon';

export class CouponResponse {
  public id?: string;
  public type: 'coupon';
  public title: string;
  public header: string;
  public message: string;
  public paymentProviderId: string;
  public accountId: string;

  constructor(coupon: Coupon) {
    this.id = coupon.id.value;
    this.type = 'coupon';
    this.title = coupon.title;
    this.header = coupon.header;
    this.message = coupon.message;
    this.paymentProviderId = coupon.paymentProviderId;
    this.accountId = coupon.account.value;
  }
}
