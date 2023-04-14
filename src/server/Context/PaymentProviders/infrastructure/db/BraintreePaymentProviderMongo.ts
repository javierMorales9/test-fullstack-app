import { Schema } from 'mongoose';
import { PaymentProviderModel } from './PaymentProviderMongo';

export interface BraintreePaymentProviderMongo {
  account: string;
  merchantId: string;
  publicKey: string;
  privateKey: string;
}

const BraintreePaymentProviderSchema =
  new Schema<BraintreePaymentProviderMongo>({
    account: { type: String, ref: 'Account' },
    merchantId: { type: String, required: true },
    publicKey: { type: String, required: true },
    privateKey: { type: String, required: true },
  });

export const BraintreePaymentProviderModel =
  PaymentProviderModel.discriminator<BraintreePaymentProviderMongo>(
    'braintree',
    BraintreePaymentProviderSchema,
  );
