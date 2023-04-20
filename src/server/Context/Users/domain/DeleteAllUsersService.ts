import { UserRepository } from "./UserRepository";

export default class DeleteAllUsersService {
  constructor(private userRepo: UserRepository) {}

  async execute(accountId: string) {
    await this.userRepo.deleteAll(accountId);
  }
}
