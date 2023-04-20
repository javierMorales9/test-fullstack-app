import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User";
import { UserModel, UserMongo } from "./UserMongo";
import { transformUserFromRepo } from "./transformUserFromRepo";
import logger from "../../Shared/infrastructure/logger/logger";

export default class MongoUserRepository implements UserRepository {
  async getByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email });

    return transformUserFromRepo(user);
  }

  public async save(user: User): Promise<User | null> {
    logger.debug("Saving user to mongo");
    const userMongo: UserMongo = createUserMongo(user);
    try {
      const savedUser = await UserModel.findOneAndUpdate(
        { _id: userMongo._id },
        { ...userMongo },
        { upsert: true, new: true },
      );

      return transformUserFromRepo(savedUser);
    } catch (err: any) {
      logger.debug("User creation error: " + err.message);
      if (err.message.includes("dup key"))
        throw new Error("Duplicate email: " + user.email);
      throw new Error("Couldn't save the user correctly");
    }
  }

  public async delete(userId: string, accountId: string) {
    logger.info("Deleting the user " + userId + " from mongo");

    try {
      await UserModel.deleteOne(
        { _id: userId, account: accountId },
        { upsert: true, new: true },
      );
    } catch (err) {
      logger.info("Error deleting the user " + userId);
      throw new Error("Could not delete the user");
    }
  }

  public async deleteAll(accountId: string): Promise<void> {
    logger.debug("Delete all the Users of the account: " + accountId);

    try {
      await UserModel.deleteMany(
        { account: accountId },
        { upsert: true, new: true },
      );
    } catch (err: any) {
      logger.debug("Error deleting the Users " + err.message);
      throw new Error("Could not delete the Users from " + accountId);
    }
  }
}

function createUserMongo(user: User): UserMongo {
  return {
    _id: user.id.value,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    encryptedPassword: user.encryptedPassword,
    account: user.account.value,
  };
}
