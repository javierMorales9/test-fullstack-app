import { Page } from '../Page';
import { getPageByIdService } from '../PageFactory';
import { SurveyView } from '../views/SurveyView';
import { IncorrectPageAnsweredError } from '../../../../Sessions/domain/IncorrectPageAnsweredError';

export class SurveyAnswer {
  public readonly type = 'survey';

  constructor(public page: Page, public answer: string | null) {}

  public static async createFromScratch(data: any) {
    if (!data.page || data.type !== 'survey')
      throw new Error('Bad Survey page answer');

    const page = await getPageByIdService(data.page);
    const answer = data.answer as string;

    return new SurveyAnswer(page, answer);
  }

  public static async createEmpty(view: SurveyView) {
    const page = await getPageByIdService(view.id);
    return new SurveyAnswer(page, null);
  }

  public complete(data: any) {
    if (data.page !== this.page.id)
      throw new IncorrectPageAnsweredError(this.page, data);

    if (!(typeof data.answer === 'string'))
      throw new Error('Bad Survey page answer');

    this.answer = data.answer;
  }
}
