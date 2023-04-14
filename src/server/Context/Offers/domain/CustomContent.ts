import { Offer } from './Offer';
import { CustomContentRequest } from './request/CustomContentRequest';

export class CustomContent extends Offer {
  constructor(
    type: 'customcontent',
    title: string,
    public content: string,
    account: string,
    id?: string,
  ) {
    super(type, title, '', account, id);
  }

  public static fromOfferRequest(
    request: CustomContentRequest,
    account: string,
  ): CustomContent {
    return new CustomContent(
      request.type,
      request.title,
      request.content,
      account,
      request.id,
    );
  }
}
