import braintree from 'braintree';
import { PaymentProvider } from '../domain/paymentProvider';
import { PlanPaymentData } from '../domain/PlanPaymentData';
import { UserData } from '../../../Context/Shared/domain/UserData';
import logger from '../../../Context/Shared/infrastructure/logger/logger';
import errorLogger from '../../../Context/Shared/infrastructure/error_logger/ErrorLogger';
import { CouponPaymentDataAlternative } from '../../Offers/domain/CouponPaymentData';

export class BraintreePaymentProvider implements PaymentProvider {
  public readonly type = 'braintree';
  public readonly account: string;
  public readonly privateKey: string;
  public readonly merchantId: string;
  public readonly publicKey: string;
  public gateway: braintree.BraintreeGateway;

  constructor(
    privateKey: string,
    merchantId: string,
    publicKey: string,
    accountId: string,
  ) {
    this.privateKey = privateKey;
    this.merchantId = merchantId;
    this.publicKey = publicKey;
    this.account = accountId;

    const environment =
      process.env.NODE_ENV === 'production'
        ? braintree.Environment.Production
        : braintree.Environment.Sandbox;
    this.gateway = new braintree.BraintreeGateway({
      environment: environment,
      merchantId: this.merchantId,
      publicKey: this.publicKey,
      privateKey: this.privateKey,
    });
  }

  public async getUserData(userId: string): Promise<UserData | null> {
    if (!this.merchantId || !this.publicKey || !this.privateKey)
      throw new Error('Braintree api keys are not defined');

    try {
      const subscription = await this.gateway.subscription.find(userId);
      const plans = (await this.gateway.plan.all()).plans;
      const plan = plans.find((plan) => plan.id === subscription.planId);
      if (!plan) throw new Error();

      const price = Number(plan.price);
      const status = convertToNormalizedStatus(subscription.status);
      const subscriptionStartDate = new Date(subscription.createdAt);
      const subscriptionAge = subscription.currentBillingCycle;

      return new UserData(
        subscription.id,
        plan.name,
        price,
        'month',
        subscriptionAge,
        subscriptionStartDate,
        status,
      );
    } catch (err: any) {
      if (err.type === 'notFoundError') {
        logger.debug('Subscription not found: ' + userId);
        throw new Error('Subscription not found: ' + userId);
      }
      if (err.type === 'authenticationError') {
        logger.debug('Invalid API keys');
        throw new Error('Invalid API keys');
      }
      errorLogger.errorFound('Getting the user Data', {
        braintreeError: err.message,
      });
      throw new Error("Couldn't get user data");
    }
  }

  public async validateApiKey(apiKey: string) {
    if (!this.merchantId || !this.publicKey || !apiKey)
      throw new Error('Braintree api keys are not defined');

    const gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: this.merchantId,
      publicKey: this.publicKey,
      privateKey: apiKey,
    });

    try {
      await gateway.customer.find('invalidCustomerId');
      throw new Error('Strange Braintree behaviour');
    } catch (err: any) {
      if (err.type === 'notFoundError') return;
      if (err.type === 'authenticationError') {
        logger.debug('Invalid api key ' + apiKey + '. Error: ' + err.message);
        throw new Error('Invalid API keys');
      }
      errorLogger.errorFound('Validating braintree api', {
        braintreeError: err.message,
      });
      throw new Error('Invalid API keys');
    }
  }

  public async validateUser(userId: string) {
    await this.getUserData(userId);
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
    if (!this.merchantId || !this.publicKey || !this.privateKey)
      throw new Error('Braintree api keys are not defined');

    const gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: this.merchantId,
      publicKey: this.publicKey,
      privateKey: this.privateKey,
    });
    try {
      const coupons = await gateway.discount.all();

      return coupons.map((coupon) => {
        return {
          id: coupon.id,
          name: coupon.name,
          duration: coupon.numberOfBillingCycles
            ? Number(coupon.numberOfBillingCycles)
            : null,
          basedOnPercentage: false,
          basedOnAmount: true,
          amount: Number(coupon.amount),
          percent_off: Number(coupon.amount),
          valid: true,
        };
      });
    } catch (err: any) {
      if (err.type === 'authenticationError') {
        logger.debug('Invalid API keys');
        throw new Error('Invalid API keys');
      }
      errorLogger.errorFound('Getting the braintree plans', {
        braintreeError: err.message,
      });
      throw new Error("Couldn't get the plans data");
    }
  }

  public async getPlans(): Promise<PlanPaymentData[]> {
    if (!this.merchantId || !this.publicKey || !this.privateKey)
      throw new Error('Braintree api keys are not defined');

    const gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: this.merchantId,
      publicKey: this.publicKey,
      privateKey: this.privateKey,
    });
    try {
      const braintreePlans = (await gateway.plan.all()).plans;
      return braintreePlans.map((plan) => {
        return {
          id: plan.id,
          name: plan.name,
          price: Number(plan.price),
          interval: plan.billingFrequency === 1 ? 'month' : 'year',
          product: null,
        } as PlanPaymentData;
      });
    } catch (err: any) {
      if (err.type === 'authenticationError') {
        logger.debug('Invalid API keys');
        throw new Error('Invalid API keys');
      }
      errorLogger.errorFound('Getting the braintree plans', {
        braintreeError: err.message,
      });
      throw new Error("Couldn't get the plans data");
    }
  }

  /*
  private async getSubscription(id: string) {
    try {
      const subscription = await this.gateway.subscription.find(id);
    } catch (err) {
      const user = await this.getCustomer(id);
    }
  }

  private async getCustomer(id: string) {
    const stream = await this.gateway.transaction.search(
      (search) => {
        search.customerId().is('the_customer_id');
      },
      (err, response) => {
        response.each((err, transaction) => {
          console.log(transaction.amount);
        });
      },
    );
  }
   */
}

function convertToNormalizedStatus(status: string): 'active' {
  return 'active';
}

export async function validaBraintreeApiKey(
  merchantId: string,
  publicKey: string,
  privateKey: string,
) {
  const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: merchantId,
    publicKey: publicKey,
    privateKey: privateKey,
  });

  try {
    await gateway.customer.find('invalidCustomerId');
    throw new Error('Strange Braintree behaviour');
  } catch (err: any) {
    if (err.type === 'notFoundError') return;
    if (err.type === 'authenticationError') {
      logger.debug('Invalid keys. Error: ' + err.message);
      throw new Error('Invalid API keys');
    }
    errorLogger.errorFound('Validating braintree api', {
      braintreeError: err.message,
    });
    throw new Error('Invalid API keys');
  }
}
