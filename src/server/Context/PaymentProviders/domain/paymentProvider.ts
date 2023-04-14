import { PlanPaymentData } from './PlanPaymentData';
import { UserData } from '../../../Context/Shared/domain/UserData';
import { CouponPaymentDataAlternative } from '../../Offers/domain/CouponPaymentData';

export interface PaymentProvider {
  type: string;
  account: string;
  getUserData: (userId: string) => Promise<UserData | null>;
  pauseSubscription: (subscriptionId: string, answer: number) => Promise<void>;
  applyCoupon: (subscriptionId: string, couponId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  validateApiKey: (apiKey: string) => Promise<void>;
  validateUser: (userId: string) => Promise<void>;
  getCouponsData: () => Promise<CouponPaymentDataAlternative[]>;
  getPlans: () => Promise<PlanPaymentData[] | string[]>;
}
