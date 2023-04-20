import { PaymentProviderRepository } from "../domain/PaymentProviderRepository";
import { Uuid } from "../../../Context/Shared/domain/value-object/Uuid";

export default class IntegratedPaymentProvidersGetter {
  constructor(private paymentProviderRepo: PaymentProviderRepository) {}

  public async execute(accountId: Uuid) {
    const all = await this.paymentProviderRepo.getAll(accountId.value);
    const apps = all.map((el) => el.type);
    if (process.env.NODE_ENV === "development") apps.push("local");
    return apps;
  }
}
