import { User } from "../domain/User";
import { Uuid } from "../../Shared/domain/value-object/Uuid";

export function transformUserFromRepo(userData: any) {
  if (userData === null) return null;

  const mongoUser = userData._doc ? userData._doc : userData;

  return User.fromPrimitives({
    id: mongoUser._id.toString(),
    firstName: mongoUser.firstName,
    lastName: mongoUser.lastName,
    email: mongoUser.email,
    encryptedPassword: mongoUser.encryptedPassword,
    account: mongoUser.account,
  });
}

export function transformArrayOfUsersFromRepo(mongoUsers: any[]) {
  const users: User[] = [];

  for (const userToTransform of mongoUsers) {
    const user = transformUserFromRepo(userToTransform);

    if (user != null) users.push(user);
  }

  return users;
}
