import { PaymentProviderRepository } from "../PaymentProviderRepository";
import { Uuid } from "../../../../Context/Shared/domain/value-object/Uuid";
import logger from "../../../../Context/Shared/infrastructure/logger/logger";

export default class DeleteAllPaymentProvidersOfAnAccountService {
  constructor(private paymentProviderRepo: PaymentProviderRepository) {}

  async execute(accountId: Uuid) {
    logger.debug("Delete all payment providers of the account " + accountId);
    await this.paymentProviderRepo.deleteAll(accountId.value);
  }
}
