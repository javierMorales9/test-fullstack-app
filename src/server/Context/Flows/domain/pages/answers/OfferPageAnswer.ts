import { Page } from "../Page";
import { getPageByIdService } from "../PageFactory";
import { OfferPageView } from "../views/OfferPageView";
import { IncorrectPageAnsweredError } from "../../../../Sessions/domain/IncorrectPageAnsweredError";
import { Pause } from "../../../../Offers/domain/Pause";
import { Coupon } from "../../../../Offers/domain/Coupon";
import { CustomContent } from "../../../../Offers/domain/CustomContent";
import { OfferResponse } from "../../../../Offers/domain/response/OfferResponse";
import logger from "../../../../../Context/Shared/infrastructure/logger/logger";
import GetOfferByIdService from "../../../../Offers/domain/services/GetOfferByIdService";
import container from "~/server/api/dependency_injection";

export class OfferPageAnswer {
  public readonly type = "offerpage";

  constructor(
    public readonly page: Page,
    public answer: boolean | null,
    public readonly data: OfferAnswerData,
  ) {}

  public complete(data: any) {
    if (data.page !== this.page.id)
      throw new IncorrectPageAnsweredError(this.page, data);

    if (!(typeof data.answer === "boolean"))
      throw new Error("Bad Offer page answer");

    this.data.complete(data.data);

    this.answer = data.answer;
  }

  public static async createFromScratch(data: any) {
    if (!data.page || data.type !== "offerpage")
      throw new Error("Bad Offer page answer");

    const page = await getPageByIdService(data.page);
    const answer = data.answer as boolean;
    const offerData = await OfferPageAnswer.createOfferData(data.data);

    return new OfferPageAnswer(page, answer, offerData);
  }

  private static async createOfferData(offerData: any) {
    if (!offerData.offer || !(typeof offerData.offer === "string"))
      throw new Error("Incorrect offer data");

    const getOfferByIdService = container.get<GetOfferByIdService>(
      "Offers.domain.GetOfferByIdService",
    );
    const offer = await getOfferByIdService.execute(offerData.offer);

    switch (offer.type) {
      case "pause":
        return OfferAnswerDataPause.createFromScratch(
          offer as Pause,
          offerData,
        );
      case "coupon":
        return OfferAnswerDataCoupon.createFromScratch(
          offer as Coupon,
          offerData,
        );
      case "customcontent":
        return OfferAnswerDataCustomContent.createFromScratch(
          offer as CustomContent,
          offerData,
        );
      default:
        throw new Error("Incorrect offer data");
    }
  }

  public static async createEmpty(view: OfferPageView) {
    const page = await getPageByIdService(view.id);
    const data = await this.createEmptyOfferData(view.offerInfo);
    return new OfferPageAnswer(page, null, data);
  }

  private static async createEmptyOfferData(offerInfo: OfferResponse) {
    const getOfferByIdService = container.get<GetOfferByIdService>(
      "Offers.domain.GetOfferByIdService",
    );
    const offer = await getOfferByIdService.execute(offerInfo.id!);

    switch (offerInfo.type) {
      case "pause":
        return OfferAnswerDataPause.createEmpty(offer as Pause);
      case "coupon":
        return OfferAnswerDataCoupon.createEmpty(offer as Coupon);
      case "customcontent":
        return OfferAnswerDataCustomContent.createEmpty(offer as CustomContent);
    }
  }
}

export type OfferAnswerData =
  | OfferAnswerDataPause
  | OfferAnswerDataCoupon
  | OfferAnswerDataCustomContent;

export class OfferAnswerDataPause {
  constructor(public offer: Pause, public monthPaused: number | null) {}

  public static createFromScratch(pause: Pause, data: any) {
    return new OfferAnswerDataPause(pause, data.monthPaused);
  }

  public static createEmpty(offer: Pause) {
    return new OfferAnswerDataPause(offer, null);
  }

  public complete(data: any) {
    let monthPaused = data.monthPaused;
    if (!monthPaused || typeof monthPaused !== "number") monthPaused = 0;

    this.monthPaused = monthPaused;
  }
}

export class OfferAnswerDataCoupon {
  constructor(public offer: Coupon) {}

  public static createFromScratch(coupon: Coupon, data: any) {
    return new OfferAnswerDataCoupon(coupon);
  }

  public static createEmpty(offer: Coupon) {
    return new OfferAnswerDataCoupon(offer);
  }

  public complete() {
    logger.debug("complete of OfferAnswerDataCoupon");
  }
}

export class OfferAnswerDataCustomContent {
  constructor(public offer: CustomContent) {}

  public static createFromScratch(customContent: CustomContent, data: any) {
    return new OfferAnswerDataCustomContent(customContent);
  }

  public static createEmpty(offer: CustomContent) {
    return new OfferAnswerDataCustomContent(offer);
  }

  public complete() {
    logger.debug("complete answer of CustomContent offer");
  }
}
