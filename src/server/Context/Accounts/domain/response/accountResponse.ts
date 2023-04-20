import { Account } from "../account";
import { CompanyData } from "../CompanyData";

export class AccountResponse {
  readonly id: string;
  readonly apiKey: string;
  readonly companyData?: CompanyData;
  readonly paymentType?: string;
  readonly imageUrl?: string;
  readonly allowedDomains: string[];

  constructor(account: Account) {
    this.id = account.id.value;
    this.apiKey = account.apiKey;
    this.companyData = account.companyData;
    this.paymentType = account.paymentType;
    this.imageUrl = account.imageUrl;
    this.allowedDomains = account.allowedDomains;
  }
}
