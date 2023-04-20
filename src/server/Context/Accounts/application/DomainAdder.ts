import AccountRepository from "../domain/repos/accountRepository";
import { Account } from "../domain/account";

export default class DomainAdder {
  constructor(private accountRepo: AccountRepository) {}

  public async execute(account: Account, domains: string[]) {
    account.addDomains(domains);
    return await this.accountRepo.save(account);
  }
}
