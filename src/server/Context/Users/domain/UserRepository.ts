import { User } from './User';

export interface UserRepository {
  getByEmail: (name: string) => Promise<User | null>;
  save: (user: User) => Promise<User | null>;
  delete: (userId: string, accountId: string) => Promise<void>;
  deleteAll: (accountId: string) => Promise<void>;
}
