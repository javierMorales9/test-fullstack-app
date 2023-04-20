export class CouponRequest {
  public type: "coupon";
  public title: string;
  header: string;
  public message: string;
  public paymentProviderId: string;
  public id?: string;

  constructor(data: any) {
    if (
      !data.type ||
      data.type !== "coupon" ||
      !data.title ||
      !data.header ||
      !data.message ||
      !data.paymentProviderId
    )
      throw new Error("Bad Coupon Offer");

    this.type = data.type;
    this.title = data.title;
    this.header = data.header;
    this.message = data.message;
    this.paymentProviderId = data.paymentProviderId;
    this.id = data.id || undefined;
  }
}
