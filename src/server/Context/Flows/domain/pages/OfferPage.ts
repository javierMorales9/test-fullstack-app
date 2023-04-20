import { MapRequest, OfferPageRequest } from "./input/OfferPageRequest";
import { Page } from "./Page";
import { OfferPageView } from "./views/OfferPageView";
import { Answer } from "./answers/Answer";
import GenerateOfferResponseService from "../../../Offers/domain/services/GenerateOfferResponseService";
import container from "~/server/api/dependency_injection";

export class OfferPage extends Page {
  constructor(
    type: "offerpage",
    public maps: Map[],
    order: number,
    id?: string,
  ) {
    super(type, order, id);
  }

  public static fromPageRequest(request: OfferPageRequest): OfferPage {
    return new OfferPage(
      request.type,
      request.maps.map((el) => Map.fromRequest(el)),
      request.order,
      request.id,
    );
  }

  public async generateView(
    answers: Answer[],
    accountId: string,
  ): Promise<OfferPageView | null> {
    const generateOfferResponseService =
      container.get<GenerateOfferResponseService>(
        "Offers.domain.GenerateOfferResponseService",
      );
    const correctMap = this.checkMaps(answers);

    if (correctMap) {
      const offerResponse = await generateOfferResponseService.execute(
        correctMap.offer,
      );
      return new OfferPageView(this, offerResponse);
    }

    return null;
  }

  //Basically check which offer to choose depending on the answer.
  private checkMaps(answers: Answer[]) {
    for (const map of this.maps)
      for (const survey of map.surveys)
        for (const answer of answers)
          if (
            answer.page.type === "survey" &&
            typeof answer.answer === "string" &&
            answer.page.id === survey.survey &&
            survey.possibleAnswers.includes(answer.answer)
          ) {
            return map;
          }

    return null;
  }
}

export class Map {
  constructor(
    public surveys: {
      survey: string;
      possibleAnswers: [string];
    }[],
    public audiences: string[],
    public offer: string,
  ) {}

  public static fromRequest(request: MapRequest) {
    return new Map(request.surveys, request.audiences, request.offer);
  }
}
