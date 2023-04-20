import { SurveyAnswer } from "./SurveyAnswer";
import { OfferPageAnswer } from "./OfferPageAnswer";
import { CancelAnswer } from "./CancelAnswer";
import { TextAreaAnswer } from "./TextAreaAnswer";

export type Answer =
  | SurveyAnswer
  | OfferPageAnswer
  | CancelAnswer
  | TextAreaAnswer;
