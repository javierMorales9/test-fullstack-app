import { model, Schema } from 'mongoose';
import { CompanyData } from '../domain/CompanyData';

export interface AccountMongo {
  _id: string;
  apiKey: string;
  companyData?: CompanyData;
  paymentType?: string;
  privateKey?: string;
  hash: string;
  salt: string;
  imageUrl?: string;
  allowedDomains: string[];
}

const CompanyDataSchema = new Schema<CompanyData>({
  name: String,
  socialReason: String,
  localization: String,
  cif: String,
  address: String,
  postalCode: String,
  phone: String,
});

const AccountSchema = new Schema<AccountMongo>({
  _id: { type: String },
  apiKey: { type: String, required: true },
  companyData: { type: CompanyDataSchema },
  paymentType: { type: String },
  privateKey: { type: String },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  imageUrl: String,
  allowedDomains: { type: [String] },
});

export const AccountModel = model<AccountMongo>('Account', AccountSchema);
