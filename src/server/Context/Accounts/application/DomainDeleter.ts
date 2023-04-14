import AccountRepository from '../domain/repos/accountRepository';
import { Account } from '../domain/account';

export default class DomainDeleter {
  constructor(private accountRepo: AccountRepository) {}

  public async execute(account: Account, domain: string) {
    account.deleteDomain(domain);
    return await this.accountRepo.save(account);
  }
}
