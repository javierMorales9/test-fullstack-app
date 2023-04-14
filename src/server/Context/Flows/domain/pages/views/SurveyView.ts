import { View } from './View';
import { Survey } from '../Survey';

export class SurveyView extends View {
  public title: string;
  public hint: string;
  public options: string[];

  public constructor(survey: Survey) {
    super(survey.id, survey.type);

    this.title = survey.title;
    this.hint = survey.hint;
    this.options = survey.options;
  }
}
