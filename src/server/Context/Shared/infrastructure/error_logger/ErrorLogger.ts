import * as Sentry from '@sentry/node';
import { Hub } from '@sentry/node';
import crypto from 'crypto';

class ErrorLogger {
  private transactions = new Map<string, ReturnType<Hub['startTransaction']>>();

  constructor() {
    Sentry.init({
      dsn: process.env.SENTRY_URL,

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value request production
      tracesSampleRate: 1.0,
    });
  }

  public startCapturingError(name: string) {
    const newTransaction = Sentry.startTransaction({
      op: 'test',
      name,
    });
    const transactionToken = crypto.randomBytes(64).toString('hex');

    this.transactions.set(transactionToken, newTransaction);

    return transactionToken;
  }

  public errorFound(errorName: string, extra: { [key: string]: string }) {
    Sentry.captureMessage(errorName, {
      level: 'error',
      extra,
    });
  }

  public endTransaction(token: string) {
    const transaction = this.transactions.get(token);
    if (!transaction) return;
    transaction.finish();
  }
}

const errorLogger = new ErrorLogger();
export default errorLogger;
