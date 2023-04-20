import { Account } from "../domain/account";
import AccountRepository from "../domain/repos/accountRepository";
import { AccountModel, AccountMongo } from "./accountMongo";
import {
  transformToAccountFromRepo,
  transformToArrayOfAccountsFromRepo,
} from "./transformToAccountFromRepo";
import logger from "../../Shared/infrastructure/logger/logger";

export default class MongoAccountRepository implements AccountRepository {
  async getAll(): Promise<Account[]> {
    const accounts = await AccountModel.find();
    return transformToArrayOfAccountsFromRepo(accounts);
  }

  async getById(id: string): Promise<Account | null> {
    const account = await AccountModel.findOne({ _id: id });
    return transformToAccountFromRepo(account);
  }

  async getByCompanyName(name: string): Promise<Account | null> {
    const account = await AccountModel.findOne({ companyName: name });
    return transformToAccountFromRepo(account);
  }

  async getByEncryptedApiKey(
    hash: string,
    salt: string,
  ): Promise<Account | null> {
    const account = await AccountModel.findOne({ hash, salt });
    return transformToAccountFromRepo(account);
  }

  async save(account: Account): Promise<Account | null> {
    logger.debug("Saving account to mongo");
    const accountMongo: AccountMongo =
      MongoAccountRepository.createAccountMongo(account);

    try {
      const savedAccount = await AccountModel.findOneAndUpdate(
        { _id: accountMongo._id },
        { ...accountMongo },
        { upsert: true, new: true },
      );

      return transformToAccountFromRepo(savedAccount);
    } catch (err: any) {
      logger.debug("Account creation error: " + err.message);
      throw new Error("Couldn't save the account correctly");
    }
  }

  public async delete(accountId: string) {
    logger.debug("Delete account: " + accountId);

    try {
      await AccountModel.deleteOne(
        { _id: accountId },
        { upsert: true, new: true },
      );
    } catch (err: any) {
      logger.debug("Error deleting the account " + err.message);
      throw new Error("Could not delete the account " + accountId);
    }
  }

  private static createAccountMongo(account: Account): AccountMongo {
    return {
      _id: account.id.value,
      apiKey: account.apiKey,
      companyData: account.companyData,
      paymentType: account.paymentType,
      privateKey: account.privateKey,
      hash: account.hash,
      salt: account.salt,
      imageUrl: account.imageUrl,
      allowedDomains: account.allowedDomains,
    };
  }
}
