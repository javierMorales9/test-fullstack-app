import { AccountResponse } from './response/accountResponse';

export type SuccessAccountLoginMessage = {
  success: true;
  account: AccountResponse;
  token: string;
  expiresIn: string;
};
