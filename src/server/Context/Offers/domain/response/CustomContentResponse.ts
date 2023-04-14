import { CustomContent } from '../CustomContent';

export class CustomContentResponse {
  public id?: string;
  public type: 'customcontent';
  public title: string;
  public content: string;
  public accountId: string;

  constructor(customContent: CustomContent) {
    this.id = customContent.id.value;
    this.type = 'customcontent';
    this.title = customContent.title;
    this.content = customContent.content;
    this.accountId = customContent.account.value;
  }
}
