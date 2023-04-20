import { Account } from "../domain/account";
import DeleteAccountService from "../domain/services/DeleteAccountService";

export default class AccountDeleter {
  constructor(private deleteAccountService: DeleteAccountService) {}

  public async execute(account: Account): Promise<void> {
    await this.deleteAccountService.execute(account);
  }
}
