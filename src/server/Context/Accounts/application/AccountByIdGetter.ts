import { Account } from '../domain/account';
import AccountRepository from '../domain/repos/accountRepository';
import logger from '../../Shared/infrastructure/logger/logger';
import AccountNotFoundError from '../domain/errors/AccountNotFoundError';

export default class AccountByIdGetter {
  constructor(private accountRepo: AccountRepository) {}

  async getById(id: string): Promise<Account> {
    logger.debug('Getting the account with id: ' + id);

    const account = await this.accountRepo.getById(id);

    if (!account) throw new AccountNotFoundError('Account with id: ' + id);

    return account;
  }
}
