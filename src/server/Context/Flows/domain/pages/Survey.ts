import { Page } from './Page';
import { SurveyRequest } from './input/SurveyRequest';
import { SurveyView } from './views/SurveyView';
import { Answer } from './answers/Answer';

export class Survey extends Page {
  constructor(
    type: 'survey',
    order: number,
    public title: string,
    public hint: string,
    public options: string[],
    id?: string,
  ) {
    super(type, order, id);
  }

  public static fromPageRequest(request: SurveyRequest): Survey {
    return new Survey(
      request.type,
      request.order,
      request.title,
      request.hint,
      request.options,
      request.id,
    );
  }

  public generateView(answers: Answer[]): Promise<SurveyView> {
    return Promise.resolve(new SurveyView(this));
  }
}
