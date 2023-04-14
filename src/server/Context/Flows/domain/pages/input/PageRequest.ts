import { CancelRequest } from './CancelRequest';
import { OfferPageRequest } from './OfferPageRequest';
import { SurveyRequest } from './SurveyRequest';
import { TextAreaRequest } from './TextAreaRequest';

export type PageRequest =
  | SurveyRequest
  | OfferPageRequest
  | CancelRequest
  | TextAreaRequest;
