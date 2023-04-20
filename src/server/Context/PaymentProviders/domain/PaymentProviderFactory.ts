import { PaymentProvider } from "./paymentProvider";
import { LocalPaymentProvider } from "../infrastructure/LocalPaymentProvider";
import {
  StripePaymentProvider,
  validateStripeApiKey,
} from "../infrastructure/stripePaymentProvider";
import {
  BraintreePaymentProvider,
  validaBraintreeApiKey,
} from "../infrastructure/BraintreePaymentProvider";

export async function paymentProviderFactory(
  paymentProviderData: any,
  accountId: string,
): Promise<PaymentProvider> {
  if (!paymentProviderData.type)
    throw new Error("Bad Data: field 'type' is required");

  switch (paymentProviderData.type) {
    case "local":
      return new LocalPaymentProvider();
    case "stripe":
      if (!paymentProviderData.apiKey)
        throw new Error(
          "Bad Data: apiKey field is required request stripe integration",
        );
      await validateStripeApiKey(paymentProviderData.apiKey);
      return new StripePaymentProvider(paymentProviderData.apiKey, accountId);
    case "braintree":
      const { merchantId, publicKey, privateKey } = paymentProviderData;
      if (!merchantId || !publicKey || !privateKey)
        throw new Error(
          "Bad Data: merchantId, publicKey and privateKey fields are required request braintree integration",
        );
      await validaBraintreeApiKey(merchantId, publicKey, privateKey);
      return new BraintreePaymentProvider(
        privateKey,
        merchantId,
        publicKey,
        accountId,
      );
    default:
      throw new Error("Not supported payment provider pamentProvider.type");
  }
}
