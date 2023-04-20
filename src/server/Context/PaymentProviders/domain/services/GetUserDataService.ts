import GetPaymentProviderService from "./GetPaymentProviderService";

export default class GetUserDataService {
  constructor(private getPaymentProvider: GetPaymentProviderService) {}

  public async execute(
    userId: string,
    accountId: string,
    paymentProvider?: string,
  ) {
    if (!paymentProvider) paymentProvider = "stripe";
    const paymentRepo = await this.getPaymentProvider.execute(
      paymentProvider,
      accountId,
    );
    const userData = await paymentRepo.getUserData(userId);

    if (!userData)
      throw new Error("User given with id: " + userId + " don't exist");

    return userData;
  }
}
