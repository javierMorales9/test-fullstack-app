export class OfferPageRequest {
  public type: "offerpage";
  public maps: MapRequest[];
  public order: number;
  public id?: string;

  constructor(data: any) {
    if (!data.type || data.type !== "offerpage" || !data.maps || !data.order)
      throw new Error("Bad Offer Page");
    this.type = "offerpage";
    this.maps = data.maps.map((el: any) => new MapRequest(el));
    this.order = data.order;
    this.id = data.id || undefined;
  }
}

export class MapRequest {
  public surveys: SurveyMapRequest[];
  public audiences: string[];
  public offer: string;

  constructor(data: any) {
    if (!data.surveys || !data.audiences || !data.offer)
      throw new Error("Bad survey response/audience - offer mapping");

    this.surveys = data.surveys.map((el: any) => new SurveyMapRequest(el));
    this.audiences = data.audiences;
    this.offer = data.offer;
  }
}

class SurveyMapRequest {
  public survey: string;
  public possibleAnswers: [string];

  constructor(data: any) {
    if (!data.survey || !data.possibleAnswers)
      throw new Error("Bad survey reference request the offer page");

    this.survey = data.survey;
    this.possibleAnswers = data.possibleAnswers;
  }
}
