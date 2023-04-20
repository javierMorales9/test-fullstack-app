import AccountRepository from "../repos/accountRepository";
import AccountNotFoundError from "../errors/AccountNotFoundError";

export default class GetAccountByIdService {
  constructor(private accountRepo: AccountRepository) {}

  public async execute(id: string) {
    const account = await this.accountRepo.getById(id);

    if (!account) throw new AccountNotFoundError();

    return account;
  }
}
