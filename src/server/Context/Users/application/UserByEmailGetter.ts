import { UserRepository } from '../domain/UserRepository';
import { User } from '../domain/User';
import { UserNotFoundError } from '../domain/errors/UserNotFoundError';
import { Account } from '../../Accounts/domain/account';
import AccountRepository from '../../Accounts/domain/repos/accountRepository';

export class UserByEmailGetter {
  constructor(
    private userRepo: UserRepository,
    private accountRepo: AccountRepository,
  ) {}

  async execute(email: string): Promise<{ user: User; account: Account }> {
    const user = await this.userRepo.getByEmail(email);

    if (!user) throw new UserNotFoundError('User with email: ' + email);

    const account = await this.accountRepo.getById(user.account.value);

    if (!account) throw new Error();

    return { user, account };
  }
}
