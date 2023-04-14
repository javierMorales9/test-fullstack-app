import bcrypt from 'bcrypt';
import { UserRequest } from './UserRequest';
import { Uuid } from '../../Shared/domain/value-object/Uuid';

export class User {
  constructor(
    public id: Uuid,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly encryptedPassword: string,
    public readonly account: Uuid,
  ) {}

  static async create(request: UserRequest, accountId: Uuid) {
    const encryptedPassword = await encryptPassword(request.password);
    const id = request.id ? new Uuid(request.id) : Uuid.random();

    return new User(
      id,
      request.firstName,
      request.lastName,
      request.email,
      encryptedPassword,
      accountId,
    );
  }

  static fromPrimitives(data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
    account: string;
  }) {
    return new User(
      new Uuid(data.id),
      data.firstName,
      data.lastName,
      data.email,
      data.encryptedPassword,
      new Uuid(data.account),
    );
  }
}

async function encryptPassword(password: string) {
  return await bcrypt.hash(password, 7);
}
