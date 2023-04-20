import { CompanyData } from "../CompanyData";

export type AccountRequest = {
  paymentType?: string;
  privateKey?: string;
  companyData?: CompanyData;
};
