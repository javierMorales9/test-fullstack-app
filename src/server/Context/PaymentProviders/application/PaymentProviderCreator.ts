import { PaymentProviderRepository } from '../domain/PaymentProviderRepository';
import { PaymentProvider } from '../domain/paymentProvider';
import { paymentProviderFactory } from '../domain/PaymentProviderFactory';
import { Uuid } from '../../../Context/Shared/domain/value-object/Uuid';

export default class PaymentProviderCreator {
  constructor(private paymentProviderRepo: PaymentProviderRepository) {}

  public async execute(
    paymentProviderData: any,
    accountId: Uuid,
  ): Promise<PaymentProvider> {
    const paymentProvider = await paymentProviderFactory(
      paymentProviderData,
      accountId.value,
    );
    const response = await this.paymentProviderRepo.save(paymentProvider);
    if (!response) throw new Error('Unable to create the payment provider');

    return response;
  }
}
