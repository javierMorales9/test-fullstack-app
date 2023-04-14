import { Account } from '../account';

export default interface AccountRepository {
  getAll: () => Promise<Account[]>;
  getById: (id: string) => Promise<Account | null>;
  getByCompanyName: (name: string) => Promise<Account | null>;
  getByEncryptedApiKey: (hash: string, salt: string) => Promise<Account | null>;
  save: (account: Account) => Promise<Account | null>;
  delete: (accountId: string) => Promise<void>;
}
