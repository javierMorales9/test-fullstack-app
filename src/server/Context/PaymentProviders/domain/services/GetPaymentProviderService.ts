import { PaymentProviderNotSupportedError } from "../errors/paymentProviderNotSupportedError";
import { StripePaymentProvider } from "../../infrastructure/stripePaymentProvider";
import { LocalPaymentProvider } from "../../infrastructure/LocalPaymentProvider";
import { BraintreePaymentProvider } from "../../infrastructure/BraintreePaymentProvider";
import { PaymentProviderRepository } from "../PaymentProviderRepository";
import GetAccountByIdService from "../../../../Context/Accounts/domain/services/GetAccountByIdService";
import logger from "../../../../Context/Shared/infrastructure/logger/logger";

export default class GetPaymentProviderService {
  constructor(
    private paymentProviderRepo: PaymentProviderRepository,
    private getAccountByIdService: GetAccountByIdService,
  ) {}

  public async execute(type: string, accountId: string) {
    const account = await this.getAccountByIdService.execute(accountId);

    if (type === "stripe") {
      let paymentProvider = await this.paymentProviderRepo.get(accountId, type);
      if (!paymentProvider) {
        logger.debug(
          "Stripe payment provider not integrated, checking the account info",
        );
        logger.debug(
          "Account info: " + account.paymentType + " " + account.privateKey,
        );
        if (account.paymentType === "local") return new LocalPaymentProvider();
        if (account.paymentType !== "stripe" || !account.privateKey)
          throw new Error("Stripe is not integrated");

        paymentProvider = new StripePaymentProvider(
          account.privateKey,
          accountId,
        );
        await this.paymentProviderRepo.save(paymentProvider);
      }
      return paymentProvider as StripePaymentProvider;
    }
    if (type === "braintree") {
      const paymentProvider = await this.paymentProviderRepo.get(
        accountId,
        type,
      );
      if (!paymentProvider) throw new Error("Braintree is not integrated");
      return paymentProvider as BraintreePaymentProvider;
    }
    if (type === "local") return new LocalPaymentProvider();

    throw new PaymentProviderNotSupportedError(type);
  }
}
