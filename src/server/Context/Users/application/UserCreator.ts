import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { UserRequest } from "../domain/UserRequest";
import { UserCouldNotBeCreated } from "../domain/errors/UserCouldNotBeCreated";
import logger from "../../Shared/infrastructure/logger/logger";
import CreateSimpleAccountService from "../../Accounts/domain/services/CreateSimpleAccountService";
import { Account } from "../../Accounts/domain/account";

export class UserCreator {
  constructor(
    private userRepo: UserRepository,
    private accountCreator: CreateSimpleAccountService,
  ) {}

  async execute(
    userRequest: UserRequest,
  ): Promise<{ user: User; account: Account }> {
    try {
      const account = await this.accountCreator.execute();
      const user = await User.create(userRequest, account.id);
      const userSaved = await this.userRepo.save(user);

      if (!userSaved) throw new Error();

      logger.info("User created: " + userSaved.id);

      return { user: userSaved, account };
    } catch (error: any) {
      if (error.message.includes("Duplicate email"))
        throw new Error("Email " + userRequest.email + " already request use");
      logger.debug(error.message);
      logger.debug(
        "Unable to create user with name: " +
          userRequest.firstName +
          ". Error: " +
          error.message,
      );
      throw new UserCouldNotBeCreated();
    }
  }
}
