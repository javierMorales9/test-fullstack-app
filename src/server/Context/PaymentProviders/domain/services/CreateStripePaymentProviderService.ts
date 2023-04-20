import { paymentProviderFactory } from "../PaymentProviderFactory";
import { PaymentProviderRepository } from "../PaymentProviderRepository";

export default class CreateStripePaymentProviderService {
  constructor(private paymentProviderRepo: PaymentProviderRepository) {}

  public async execute(privateKey: string, accountId: string): Promise<any> {
    const stripeData = { type: "stripe", apiKey: privateKey };
    const paymentProvider = await paymentProviderFactory(stripeData, accountId);
    return await this.paymentProviderRepo.save(paymentProvider);
  }
}
