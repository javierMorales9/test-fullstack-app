import { PaymentProvider } from '../domain/paymentProvider';
import Stripe from 'stripe';
import { PlanPaymentData } from '../domain/PlanPaymentData';
import { UserData } from '../../../Context/Shared/domain/UserData';
import logger from '../../../Context/Shared/infrastructure/logger/logger';
import errorLogger from '../../../Context/Shared/infrastructure/error_logger/ErrorLogger';
import { CouponPaymentDataAlternative } from '../../Offers/domain/CouponPaymentData';

export class StripePaymentProvider implements PaymentProvider {
  public readonly type = 'stripe';
  public readonly apiKey: string;
  public readonly account: string;

  constructor(privateKey: string, accountId: string) {
    this.apiKey = privateKey;
    this.account = accountId;
  }

  public async getUserData(subscriptionId: string): Promise<UserData | null> {
    logger.info(
      'retrieving information of session from user with subscription ' +
        subscriptionId,
    );

    const stripe = new Stripe(this.apiKey, {
      apiVersion: '2022-11-15',
    });

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (!subscription) {
      logger.debug(
        'No subscription found for user with subscription ' + subscriptionId,
      );
      return null;
    }

    const plan = subscription.items.data[0].plan;
    if (!plan.amount) {
      throw new Error('The user subscription has no plan amount');
    }

    const date = subscription.created * 1000;

    return new UserData(
      subscriptionId,
      plan.id || '',
      plan.amount / 100 || 0,
      plan.interval,
      calculateMonthsUpToToday(date),
      new Date(date),
      subscription.status,
    );
  }

  public async pauseSubscription(subscriptionId: string, answer: number) {
    try {
      logger.info('Pausing stripe subscription: ' + subscriptionId);

      const stripe = new Stripe(this.apiKey, {
        apiVersion: '2022-11-15',
      });

      const trialEndDate =
        Math.floor(new Date().getTime() / 1000) + answer * 24 * 3600 * 30;

      await stripe.subscriptions.update(subscriptionId, {
        trial_end: trialEndDate,
      });

      logger.info('Stripe subscription: ' + subscriptionId + ' paused');
    } catch (err: any) {
      logger.debug('Error while pausing the subscription: ' + err.message);
      errorLogger.errorFound('Pausing subscription error', {
        context:
          'pausing subscription ' +
          ' to ' +
          subscriptionId +
          ' request account ' +
          this.apiKey,
        stripeError: err.message,
      });
      //throw new PaymentProviderConectionError('Unable to apply pause');
    }
  }

  public async applyCoupon(subscriptionId: string, couponId: string) {
    try {
      logger.info(
        'Applying stripe coupon ' + couponId + ' to ' + subscriptionId,
      );

      const stripe = new Stripe(this.apiKey, {
        apiVersion: '2022-11-15',
      });

      await stripe.subscriptions.update(subscriptionId, {
        coupon: couponId,
      });

      logger.info('Coupon ' + couponId + 'applied to ' + subscriptionId);
    } catch (err: any) {
      logger.debug('Error while applying the coupon: ' + err.message);
      errorLogger.errorFound('Applying Coupon error', {
        context:
          'apply coupon ' +
          couponId +
          ' to ' +
          subscriptionId +
          ' request account ' +
          this.apiKey,
        stripeError: err.message,
      });
      //throw new PaymentProviderConectionError('Unable to apply coupon');
    }
  }

  public async cancelSubscription(subscriptionId: string) {
    try {
      logger.info('Canceling stripe subscription ' + subscriptionId);

      const stripe = new Stripe(this.apiKey, {
        apiVersion: '2022-11-15',
      });
      await stripe.subscriptions.del(subscriptionId);

      logger.info('Cancelling stripe finished for id: ' + subscriptionId);
    } catch (err: any) {
      logger.debug('Error while applying the cancellation: ' + err.message);
      errorLogger.errorFound('Cancelling Subscription error', {
        context:
          'cancelling subscription ' +
          subscriptionId +
          ' request account ' +
          this.apiKey,
        stripeError: err.message,
      });
      //throw new PaymentProviderConectionError(err.message);
    }
  }

  public async validateApiKey(apiKey: string): Promise<void> {
    try {
      const stripe = new Stripe(apiKey, {
        apiVersion: '2022-11-15',
      });
      await stripe.subscriptions.search({ query: "status: 'active'" });
    } catch (err: any) {
      logger.debug('Invalid api key ' + apiKey + '. Error: ' + err.message);
      throw new Error('Invalid API key');
    }
  }

  public async validateUser(userId: string): Promise<void> {
    try {
      const stripe = new Stripe(this.apiKey, {
        apiVersion: '2022-11-15',
      });
      await stripe.subscriptions.retrieve(userId);
    } catch (err: any) {
      logger.debug(
        'Invalid subscription ' + userId + '. Error: ' + err.message,
      );
      throw new Error(
        'Invalid user. Try sending the subscriptionId instead of the userId',
      );
    }
  }

  public async getCouponsData(): Promise<CouponPaymentDataAlternative[]> {
    try {
      const stripe = new Stripe(this.apiKey, {
        apiVersion: '2022-11-15',
      });
      const stripeCoupons = await stripe.coupons.list();
      return stripeCoupons.data.map((coupon: any) => {
        return {
          id: coupon.id,
          name: coupon.name || '',
          duration:
            coupon.duration === 'forever' ? null : coupon.duration_in_months,
          basedOnPercentage: coupon.percent_off !== null,
          basedOnAmount: coupon.amount_off !== null,
          amount:
            coupon.percent_off !== null
              ? coupon.percent_off
              : coupon.amount_off!,
          percent_off: Number(coupon.percent_off),
          valid: coupon.valid,
        };
      });
    } catch (err: any) {
      logger.debug(
        'Unable to get the coupons from the account ||  Error: ' + err.message,
      );
      throw new Error('Unable to get the coupons from the account');
    }
  }

  public async getPlans(): Promise<PlanPaymentData[]> {
    try {
      const stripe = new Stripe(this.apiKey, {
        apiVersion: '2022-11-15',
      });
      const activeProductIds = (
        await stripe.products.search({ query: "active:'true'" })
      ).data.map((el: any) => el.id);

      let query = '';
      for (const id of activeProductIds) query += "product:'" + id + "' OR ";
      query = query.substring(0, query.length - 4);

      const prices = (await stripe.prices.search({ query })).data;

      return prices.map((el: any) => {
        return {
          id: el.id,
          product: el.product.toString(),
          name: el.nickname || '',
          price: el.unit_amount ? el.unit_amount / 100 : 0,
          interval: el.recurring ? el.recurring.interval : 'no-interval',
        };
      });
    } catch (err: any) {
      logger.debug('Unable to get the plans data ||  Error: ' + err.message);
      throw new Error('Unable to get the plans data');
    }
  }
}

const calculateMonthsUpToToday = (createdEpochDate: number) => {
  const createdDate = new Date(createdEpochDate);
  const currentDate = new Date();

  let months = (currentDate.getFullYear() - createdDate.getFullYear()) * 12;
  months -= createdDate.getMonth();
  months += currentDate.getMonth();

  return months <= 0 ? 0 : months;
};

export async function validateStripeApiKey(apiKey: string) {
  try {
    const stripe = new Stripe(apiKey, {
      apiVersion: '2022-11-15',
    });
    await stripe.subscriptions.search({ query: "status: 'active'" });
  } catch (err: any) {
    logger.debug(
      'Invalid Stripe api key ' + apiKey + '. Error: ' + err.message,
    );
    throw new Error('Invalid API key');
  }
}
