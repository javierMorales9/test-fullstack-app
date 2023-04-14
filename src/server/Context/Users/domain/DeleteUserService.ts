import { UserRepository } from './UserRepository';

export default class DeleteUserService {
  constructor(private userRepo: UserRepository) {}

  async execute(userId: string, accountId: string) {
    await this.userRepo.delete(userId, accountId);
  }
}
