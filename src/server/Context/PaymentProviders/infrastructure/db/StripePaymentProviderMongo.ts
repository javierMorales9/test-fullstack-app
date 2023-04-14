import { Schema } from 'mongoose';
import { PaymentProviderModel } from './PaymentProviderMongo';

export interface StripePaymentProviderMongo {
  account: string;
  apiKey: string;
}

const StripePaymentProviderSchema = new Schema<StripePaymentProviderMongo>({
  account: { type: String, ref: 'Account' },
  apiKey: { type: String, required: true },
});

export const StripePaymentProviderModel =
  PaymentProviderModel.discriminator<StripePaymentProviderMongo>(
    'stripe',
    StripePaymentProviderSchema,
  );
