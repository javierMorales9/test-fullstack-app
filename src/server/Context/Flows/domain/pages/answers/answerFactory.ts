import { Page } from '../Page';
import { SurveyAnswer } from './SurveyAnswer';
import { OfferAnswerData, OfferPageAnswer } from './OfferPageAnswer';
import { CancelAnswer } from './CancelAnswer';
import { View } from '../views/View';
import { SurveyView } from '../views/SurveyView';
import { OfferPageView } from '../views/OfferPageView';
import { CancelView } from '../views/CancelView';
import { TextAreaView } from '../views/TextAreaView';
import { TextAreaAnswer } from './TextAreaAnswer';

export async function createAnswerFromScratch(data: any) {
  if (!(typeof data.type === 'string')) throw new Error('Incorrect Answer');

  switch (data.type) {
    case 'survey':
      return await SurveyAnswer.createFromScratch(data);
    case 'offerpage':
      return await OfferPageAnswer.createFromScratch(data);
    case 'textarea':
      return await TextAreaAnswer.createFromScratch(data);
    case 'cancel':
      return await CancelAnswer.createFromScratch(data);
    case 'final':
      return Promise.resolve(null);
    default:
      throw new Error('Incorrect page type ' + data.type);
  }
}

export function createAnswer(
  page: Page,
  answer: boolean | string | null,
  data?: OfferAnswerData,
) {
  switch (page.type) {
    case 'survey':
      return new SurveyAnswer(page, answer as string);
    case 'offerpage':
      if (!data) throw new Error();
      return new OfferPageAnswer(page, answer as boolean, data);
    case 'textarea':
      return new TextAreaAnswer(page, answer as string);
    case 'cancel':
      return new CancelAnswer(page, answer as boolean);
    default:
      throw new Error('Incorrect page type ' + page.type);
  }
}

export function createEmptyAnswer(view: View) {
  switch (view.type) {
    case 'survey':
      return SurveyAnswer.createEmpty(view as SurveyView);
    case 'offerpage':
      return OfferPageAnswer.createEmpty(view as OfferPageView);
    case 'textarea':
      return TextAreaAnswer.createEmpty(view as TextAreaView);
    case 'cancel':
      return CancelAnswer.createEmpty(view as CancelView);
    default:
      throw new Error('Incorrect page type ' + view.type);
  }
}
