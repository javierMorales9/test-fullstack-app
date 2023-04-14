import { User } from './User';

export class UserResponse {
  public readonly id: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly account: string;

  constructor(user: User) {
    this.id = user.id.value;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.account = user.account.value;
  }
}
