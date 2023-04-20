import { randomUUID } from "crypto";
import { CompanyData } from "./CompanyData";
import { encryptApiKey } from "../../Shared/infrastructure/security/securityUtils";
import { Uuid } from "../../Shared/domain/value-object/Uuid";

export class Account {
  readonly id: Uuid;
  readonly apiKey: string;
  readonly companyData?: CompanyData;
  /**
   * @deprecated
   */
  readonly paymentType?: string;
  /**
   * @deprecated
   */
  readonly privateKey?: string;
  private _imageUrl?: string;
  private _hash!: string;
  private _salt!: string;
  private _allowedDomains: string[];

  constructor(
    id: string,
    apiKey: string,
    paymentType?: string,
    privateKey?: string,
    companyData?: CompanyData,
    imageUrl?: string,
    allowedDomains?: string[],
  ) {
    this.id = new Uuid(id);
    this.apiKey = apiKey;
    this.paymentType = paymentType;
    this.privateKey = privateKey;
    this.companyData = companyData;
    this._imageUrl = imageUrl;
    this._allowedDomains = allowedDomains || [];
  }

  public static fromFields(
    id: string,
    apiKey: string,
    paymentType: string,
    privateKey: string,
    hash: string,
    salt: string,
    companyData: CompanyData,
    imageUrl: string,
    allowedDomains: string[],
  ) {
    const account = new Account(
      id,
      apiKey,
      paymentType,
      privateKey,
      companyData,
      imageUrl,
      allowedDomains,
    );
    account._hash = hash;
    account._salt = salt;

    return account;
  }

  public static createSimple(apiKey: string) {
    const id = randomUUID();

    const account = new Account(id, apiKey);

    account.generateHashAndSalt(apiKey);

    return account;
  }

  private generateHashAndSalt(apiKey: string) {
    const saltHash = encryptApiKey(apiKey);
    this._salt = saltHash.salt;
    this._hash = saltHash.hash;
  }

  get hash(): string {
    return this._hash;
  }

  get salt(): string {
    return this._salt;
  }

  public get imageUrl() {
    return this._imageUrl;
  }

  public setImageUrl(url: string) {
    this._imageUrl = url;
  }

  public get allowedDomains() {
    return this._allowedDomains;
  }

  public addDomains(domains: string[]) {
    domains.forEach((domain) => {
      if (validateDomain(domain) && !this._allowedDomains.includes(domain))
        this._allowedDomains.push(domain);
    });
  }

  public deleteDomain(domain: string) {
    this._allowedDomains = this._allowedDomains.filter((el) => el !== domain);
  }
}

function getFirstDayOfNextMonth() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function validateDomain(domain: string) {
  return true;
}
