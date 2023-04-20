import { OfferPage } from "../OfferPage";

export class OfferPageResponse {
  public id: string;
  public type: "offerpage";
  public maps: MapResponse[];
  public order: number;

  constructor(offerPage: OfferPage) {
    this.id = offerPage.id;
    this.type = "offerpage";
    this.maps = offerPage.maps;
    this.order = offerPage.order;
  }
}

export type MapResponse = {
  surveys: {
    survey: string;
    possibleAnswers: [string];
  }[];
  audiences: string[];
  offer: string;
};
