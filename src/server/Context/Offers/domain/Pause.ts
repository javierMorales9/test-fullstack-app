import { Offer } from './Offer';
import { PauseRequest } from './request/PauseRequest';

export class Pause extends Offer {
  constructor(
    type: 'pause',
    title: string,
    message: string,
    public maxPauseMonth: number,
    account: string,
    id?: string,
  ) {
    super(type, title, message, account, id);
  }

  public static fromOfferRequest(
    request: PauseRequest,
    account: string,
  ): Pause {
    return new Pause(
      request.type,
      request.title,
      request.message,
      request.maxPauseMonth,
      account,
      request.id,
    );
  }
}
