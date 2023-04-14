import GetPaymentProviderService from '../domain/services/GetPaymentProviderService';

export default class PlansGetter {
  constructor(private getPaymentProvider: GetPaymentProviderService) {}

  public async execute(accountId: string, paymentType?: string) {
    paymentType = paymentType || 'stripe';

    const paymentRepo = await this.getPaymentProvider.execute(
      paymentType,
      accountId,
    );
    return await paymentRepo.getPlans();
  }
}
