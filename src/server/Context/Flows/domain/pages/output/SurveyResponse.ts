import { Survey } from '../Survey';

export class SurveyResponse {
  public id: string;
  public type: 'survey';
  public title: string;
  public hint: string;
  public options: string[];
  public order: number;

  constructor(survey: Survey) {
    this.id = survey.id;
    this.type = 'survey';
    this.title = survey.title;
    this.hint = survey.hint;
    this.options = survey.options;
    this.order = survey.order;
  }
}
