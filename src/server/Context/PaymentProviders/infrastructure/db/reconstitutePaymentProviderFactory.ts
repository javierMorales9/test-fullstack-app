import { StripePaymentProvider } from "../stripePaymentProvider";
import { BraintreePaymentProvider } from "../BraintreePaymentProvider";
import { PaymentProvider } from "../../domain/paymentProvider";

export function reconstitutePaymentProviderFromMongoFactory(data: any) {
  if (!data) return null;

  const mongoData = data._doc ? data._doc : data;
  const type = mongoData.type;
  const account = mongoData.account;

  switch (type) {
    case "stripe":
      const { apiKey } = mongoData;
      return new StripePaymentProvider(apiKey, account);
    case "braintree":
      const { privateKey, publicKey, merchantId } = mongoData;
      return new BraintreePaymentProvider(
        privateKey,
        merchantId,
        publicKey,
        account,
      );
    default:
      throw new Error("Not supported payment provider" + type);
  }
}

export function reconstituteArrayOfPaymentProvidersFromMongoFactory(data: any) {
  const paymentProviders: PaymentProvider[] = [];

  for (const mongoPaymentProvider of data) {
    const paymentProvider =
      reconstitutePaymentProviderFromMongoFactory(mongoPaymentProvider);

    if (paymentProvider != null) paymentProviders.push(paymentProvider);
  }

  return paymentProviders;
}
