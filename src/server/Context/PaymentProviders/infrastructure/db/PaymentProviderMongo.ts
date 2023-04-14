import { model, Schema } from 'mongoose';

const baseOptions = {
  discriminatorKey: 'type',
};

const PaymentProviderSchema = new Schema(
  {
    _id: { type: String },
  },
  baseOptions,
);

export const PaymentProviderModel = model(
  'PaymentProvider',
  PaymentProviderSchema,
);
