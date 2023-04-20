export class PaymentProviderNotSupportedError extends Error {
  private msg: string;

  constructor(paymentProvider?: string) {
    const paymentProv = paymentProvider !== undefined ? paymentProvider : "";
    const msg = "Payment provider " + paymentProv + " not supported";

    super(msg);

    this.msg = msg;
  }

  public getMsg(): string {
    return this.msg;
  }
}
