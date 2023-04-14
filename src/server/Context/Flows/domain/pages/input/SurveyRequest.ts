export class SurveyRequest {
  public type: 'survey';
  public title: string;
  public hint: string;
  public options: string[];
  public order: number;
  public id?: string;

  constructor(data: any) {
    if (
      !data.type ||
      data.type !== 'survey' ||
      !data.title ||
      !data.hint ||
      !data.options ||
      !data.order
    )
      throw new Error('Bad Survey Page');

    this.type = data.type;
    this.title = data.title;
    this.hint = data.hint;
    this.options = data.options;
    this.order = data.order;
    this.id = data.id || undefined;
  }
}
