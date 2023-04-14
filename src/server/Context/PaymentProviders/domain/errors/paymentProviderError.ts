export class PaymentProviderConectionError extends Error {
  readonly msg;

  constructor(msg: string) {
    super();
    this.msg = msg;
  }
}
