import { Account } from "../../../Accounts/domain/account";
import { User } from "../../../Users/domain/User";

export default interface AuthUser {
  user: User;
  account: Account;
}
