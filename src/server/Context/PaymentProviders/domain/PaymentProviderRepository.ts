import { PaymentProvider } from './paymentProvider';

export interface PaymentProviderRepository {
  getAll: (accountId: string) => Promise<PaymentProvider[]>;
  get: (accountId: string, type: string) => Promise<PaymentProvider | null>;
  save: (
    paymentProviderData: PaymentProvider,
  ) => Promise<PaymentProvider | null>;
  deleteAll: (accountId: string) => Promise<void>;
}
