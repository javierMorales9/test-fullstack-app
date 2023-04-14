import { AccountResponse } from './response/accountResponse';

export interface SuccessAccountCreationMessage {
  success: boolean;
  account: AccountResponse;
  apiKey: string;
  token: string;
  expiresIn: string;
}
