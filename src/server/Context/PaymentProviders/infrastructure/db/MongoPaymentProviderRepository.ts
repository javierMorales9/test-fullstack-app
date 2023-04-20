import { PaymentProviderRepository } from "../../domain/PaymentProviderRepository";
import { LocalPaymentProvider } from "../LocalPaymentProvider";
import { PaymentProvider } from "../../domain/paymentProvider";
import { StripePaymentProviderModel } from "./StripePaymentProviderMongo";
import { BraintreePaymentProviderModel } from "./BraintreePaymentProviderMongo";
import {
  reconstituteArrayOfPaymentProvidersFromMongoFactory,
  reconstitutePaymentProviderFromMongoFactory,
} from "./reconstitutePaymentProviderFactory";
import { PaymentProviderModel } from "./PaymentProviderMongo";
import logger from "../../../../Context/Shared/infrastructure/logger/logger";

export default class MongoPaymentProviderRepository
  implements PaymentProviderRepository
{
  public async getAll(accountId: string): Promise<PaymentProvider[]> {
    const data = await PaymentProviderModel.aggregate([
      {
        $match: {
          account: accountId,
        },
      },
    ]);
    return reconstituteArrayOfPaymentProvidersFromMongoFactory(data);
  }

  public async get(
    accountId: string,
    type: string,
  ): Promise<PaymentProvider | null> {
    const data = await PaymentProviderModel.findOne({
      account: accountId,
      type: type,
    });
    return reconstitutePaymentProviderFromMongoFactory(data);
  }

  public async save(
    paymentProvider: PaymentProvider,
  ): Promise<PaymentProvider | null> {
    console.log(paymentProvider);
    let paymentProviderResponse = null;
    try {
      if (paymentProvider.type === "stripe") {
        paymentProviderResponse =
          await StripePaymentProviderModel.findOneAndUpdate(
            { account: paymentProvider.account, type: paymentProvider.type },
            { $set: { ...paymentProvider } },
            { upsert: true, new: true },
          );
      } else if (paymentProvider.type === "braintree") {
        paymentProviderResponse =
          await BraintreePaymentProviderModel.findOneAndUpdate(
            { account: paymentProvider.account, type: paymentProvider.type },
            { $set: { ...paymentProvider } },
            { upsert: true, new: true },
          );
      } else if ((paymentProvider.type = "local"))
        return new LocalPaymentProvider();

      return reconstitutePaymentProviderFromMongoFactory(
        paymentProviderResponse,
      );
    } catch (err: any) {
      logger.debug(
        "Unable to save the payment provider. Reason: " + err.message,
      );
      throw new Error("Unable to save the payment provider");
    }
  }

  public async deleteAll(accountId: string): Promise<void> {
    try {
      await PaymentProviderModel.deleteMany({ account: accountId });
    } catch (err: any) {
      logger.debug(
        "Unable to delete the payment providers. Reason: " + err.message,
      );
      throw new Error("Unable to delete the payment providers");
    }
  }
}
