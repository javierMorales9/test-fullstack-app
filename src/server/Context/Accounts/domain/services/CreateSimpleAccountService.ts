import AccountRepository from '../repos/accountRepository';
import { Account } from '../account';
import crypto from 'crypto';
import logger from '../../../Shared/infrastructure/logger/logger';
import AccountCouldNotBeCreatedError from '../errors/AccountCouldNotBeCreatedError';

export default class CreateSimpleAccountService {
  constructor(private accountRepo: AccountRepository) {}

  async execute(): Promise<Account> {
    const apiKey = crypto.randomUUID().replace(/-/g, '');
    const account = Account.createSimple(apiKey);

    try {
      const accountSaved = await this.accountRepo.save(account);
      if (!accountSaved) throw new Error();

      logger.info('Account created: ' + accountSaved.id);
      return accountSaved;
    } catch (err: any) {
      logger.debug('Unable to create new account. Error: ' + err.message);
      throw new AccountCouldNotBeCreatedError(account.id);
    }
  }
}
