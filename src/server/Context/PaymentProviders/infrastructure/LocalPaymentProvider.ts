import { PaymentProvider } from '../domain/paymentProvider';
import { UserData } from '../../../Context/Shared/domain/UserData';
import { PlanPaymentData } from '../domain/PlanPaymentData';
import { CouponPaymentDataAlternative } from '../../Offers/domain/CouponPaymentData';

export class LocalPaymentProvider implements PaymentProvider {
  public readonly type: string = 'local';
  public readonly account = 'local';

  public getUserData(userId: string): Promise<UserData | null> {
    return Promise.resolve(
      new UserData(
        '2',
        'Premium',
        12,
        'month',
        1,
        new Date('10/10/2021'),
        'active',
      ),
    );
  }

  public validateApiKey(apiKey: string) {
    return Promise.resolve();
  }

  public validateUser() {
    return Promise.resolve();
  }

  public pauseSubscription(subscriptionId: string, answer: number) {
    return Promise.resolve();
  }

  public applyCoupon(subscriptionId: string, couponId: string) {
    return Promise.resolve();
  }

  public cancelSubscription(subscriptionId: string) {
    return Promise.resolve();
  }

  public async getCouponsData(): Promise<CouponPaymentDataAlternative[]> {
    return Promise.resolve([
      {
        id: 'c9TadHmd',
        name: '15% discount',
        duration: 4,
        basedOnPercentage: false,
        basedOnAmount: true,
        amount: 14,
        percent_off: 14,
        valid: true,
      },
      {
        id: 'ZKWMlwSO',
        name: '30 euros',
        duration: null,
        basedOnPercentage: false,
        basedOnAmount: true,
        amount: 30,
        percent_off: 30,
        valid: true,
      },
    ]);
  }

  public getPlans(): Promise<PlanPaymentData[]> {
    return Promise.resolve([
      {
        id: 'price_1M9ROEK1y4c8drr8L6MN9Ld3',
        product: 'prod_MtDpLvQWTyzHk4',
        name: '',
        price: 5,
        interval: 'year',
      },
      {
        id: 'price_1M7mNwK1y4c8drr8MdzLLzLc',
        product: 'prod_MrVO5Tk551DTtP',
        name: '',
        price: 55,
        interval: 'month',
      },
      {
        id: 'price_1M7mNwK1y4c8drr8ZPclkbJX',
        product: 'prod_MrVO5Tk551DTtP',
        name: '',
        price: 45,
        interval: 'month',
      },
      {
        id: 'price_1M7mNwK1y4c8drr80RFRIwTT',
        product: 'prod_MrVO5Tk551DTtP',
        name: '',
        price: 35,
        interval: 'month',
      },
      {
        id: 'price_1M7mNwK1y4c8drr8BmzewWqZ',
        product: 'prod_MrVO5Tk551DTtP',
        name: '',
        price: 25,
        interval: 'month',
      },
      {
        id: 'price_1M7mNwK1y4c8drr83LPSh033',
        product: 'prod_MrVO5Tk551DTtP',
        name: '',
        price: 15,
        interval: 'month',
      },
      {
        id: 'price_1M7mNwK1y4c8drr8cVxVKZHU',
        product: 'prod_MrVO5Tk551DTtP',
        name: '',
        price: 5,
        interval: 'month',
      },
      {
        id: 'price_1M18ggK1y4c8drr8ckD5BEQO',
        product: 'prod_Mkdyxbpzirbr1k',
        name: 'Weekly',
        price: 30,
        interval: 'week',
      },
      {
        id: 'price_1M18ggK1y4c8drr8RHrakvRt',
        product: 'prod_Mkdyxbpzirbr1k',
        name: 'Monthly',
        price: 100,
        interval: 'month',
      },
      {
        id: 'price_1M18gfK1y4c8drr82mn77AjD',
        product: 'prod_Mkdyxbpzirbr1k',
        name: 'Annual',
        price: 1000,
        interval: 'year',
      },
    ] as PlanPaymentData[]);
  }
}
