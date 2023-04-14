import GetPaymentProviderService from '../../PaymentProviders/domain/services/GetPaymentProviderService';
import { Uuid } from '../../../Context/Shared/domain/value-object/Uuid';

export default class CouponPaymentDataGetter {
  constructor(private getPaymentProvider: GetPaymentProviderService) {}

  async execute(accountId: Uuid, paymentType?: string) {
    paymentType = paymentType || 'stripe';

    const paymentProvider = await this.getPaymentProvider.execute(
      paymentType,
      accountId.value,
    );
    return await paymentProvider.getCouponsData();
  }
}
