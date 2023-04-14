export class CustomContentRequest {
  public type: 'customcontent';
  public title: string;
  public content: string;
  public id?: string;

  constructor(data: any) {
    if (
      !data.type ||
      data.type !== 'customcontent' ||
      !data.title ||
      !data.content
    )
      throw new Error('Bad Custom Content Offer');

    this.type = data.type;
    this.title = data.title;
    this.content = data.content;
    this.id = data.id || undefined;
  }
}
