import AccountRepository from "../domain/repos/accountRepository";
import { AccountRequest } from "../domain/request/accountRequest";
import { Account } from "../domain/account";
import logger from "../../Shared/infrastructure/logger/logger";
import CreateStripePaymentProviderService from "../../PaymentProviders/domain/services/CreateStripePaymentProviderService";

export default class AccountInfoAdder {
  constructor(
    private accountRepo: AccountRepository,
    private createStripePaymentProviderService: CreateStripePaymentProviderService,
  ) {}

  async execute(
    accountRequest: AccountRequest,
    account: Account,
  ): Promise<Account> {
    try {
      const { paymentType, privateKey } = accountRequest;
      if (
        paymentType &&
        ["stripe", "local"].includes(paymentType) &&
        privateKey
      )
        await this.createStripePaymentProviderService.execute(
          privateKey,
          account.id.value,
        );
      else if (paymentType)
        throw new Error(
          "Unable to save the payment provider data for the type " +
            paymentType +
            ". Use the /payment endpoint instead",
        );

      const newAccount = new Account(
        account.id.value,
        account.apiKey,
        accountRequest.paymentType,
        accountRequest.privateKey,
        accountRequest.companyData,
        account.imageUrl,
        account.allowedDomains,
      );

      const savedAccount = await this.accountRepo.save(newAccount);
      if (!savedAccount) throw new Error();

      logger.info("Account info added for: " + savedAccount.id);

      return savedAccount;
    } catch (err: any) {
      logger.debug(
        "Unable to add info to account: " +
          accountRequest.companyData?.name +
          ". Error: " +
          err.message,
      );
      throw err;
    }
  }
}
