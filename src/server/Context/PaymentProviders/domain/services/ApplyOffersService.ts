import GetPaymentProviderService from "./GetPaymentProviderService";
import { PaymentProviderIntegrationLeftError } from "../PaymentProviderIntegrationLeftError";
import logger from "../../../../Context/Shared/infrastructure/logger/logger";
import { Pause } from "../../../Offers/domain/Pause";
import { Coupon } from "../../../Offers/domain/Coupon";
import { Session } from "../../../Sessions/domain/session";
import { OfferPageAnswer } from "../../../Flows/domain/pages/answers/OfferPageAnswer";
import { Answer } from "../../../Flows/domain/pages/answers/Answer";
import GetAccountByIdService from "../../../../Context/Accounts/domain/services/GetAccountByIdService";

export default class ApplyOfferService {
  constructor(
    private getPaymentProvider: GetPaymentProviderService,
    private getAccountService: GetAccountByIdService,
  ) {}

  async execute(session: Session, accountId: string) {
    const answerPreviousToFinal = session.answers[session.answers.length - 1];
    logger.debug(
      "applying the offer for the answer to the page " +
        answerPreviousToFinal.page.id,
    );

    if (this.isAnswerDoneToAPause(answerPreviousToFinal))
      await this.applyPause(
        session,
        ((answerPreviousToFinal as OfferPageAnswer).data.offer as Pause)
          .maxPauseMonth,
        accountId,
      );

    if (this.isAnswerDoneToACoupon(answerPreviousToFinal))
      await this.applyCoupon(
        session,
        ((answerPreviousToFinal as OfferPageAnswer).data.offer as Coupon)
          .paymentProviderId,
        accountId,
      );

    if (this.isAnswerDoneToACancel(answerPreviousToFinal))
      await this.applyCancel(session, accountId);
  }

  private isAnswerDoneToAPause(answerPreviousToFinal: Answer) {
    return (
      answerPreviousToFinal.type === "offerpage" &&
      answerPreviousToFinal.data.offer.type === "pause"
    );
  }

  private isAnswerDoneToACoupon(answerPreviousToFinal: Answer) {
    return (
      answerPreviousToFinal.type === "offerpage" &&
      answerPreviousToFinal.data.offer.type === "coupon"
    );
  }

  private isAnswerDoneToACancel(answerPreviousToFinal: Answer) {
    return answerPreviousToFinal.type === "cancel";
  }

  private async applyPause(
    session: Session,
    pausedMonths: number,
    accountId: string,
  ) {
    const account = await this.getAccountService.execute(accountId);
    const { paymentType } = account;
    if (paymentType)
      await (
        await this.getPaymentProvider.execute(paymentType, accountId)
      ).pauseSubscription(session.subscription, pausedMonths);
    else throw new PaymentProviderIntegrationLeftError();
  }

  private async applyCoupon(
    session: Session,
    couponId: string,
    accountId: string,
  ) {
    const account = await this.getAccountService.execute(accountId);
    const { paymentType } = account;
    if (paymentType)
      await (
        await this.getPaymentProvider.execute(paymentType, accountId)
      ).applyCoupon(session.subscription, couponId);
  }

  private async applyCancel(session: Session, accountId: string) {
    const account = await this.getAccountService.execute(accountId);
    const { paymentType } = account;
    if (paymentType)
      await (
        await this.getPaymentProvider.execute(paymentType, accountId)
      ).cancelSubscription(session.subscription);
  }
}
