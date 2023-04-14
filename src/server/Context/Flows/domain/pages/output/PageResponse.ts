import { SurveyResponse } from './SurveyResponse';
import { OfferPageResponse } from './OfferPageResponse';
import { CancelResponse } from './CancelResponse';
import { TextAreaResponse } from './TextAreaResponse';

export type PageResponse =
  | SurveyResponse
  | OfferPageResponse
  | CancelResponse
  | TextAreaResponse;
