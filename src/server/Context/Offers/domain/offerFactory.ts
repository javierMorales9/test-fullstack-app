import { createOfferRequest, OfferRequest } from './request/OfferRequest';
import { Pause } from './Pause';
import { Coupon } from './Coupon';
import { CustomContent } from './CustomContent';

export function createOfferFromRequest(request: OfferRequest, account: string) {
  switch (request.type) {
    case 'pause':
      return Pause.fromOfferRequest(request, account);
    case 'coupon':
      return Coupon.fromOfferRequest(request, account);
    case 'customcontent':
      return CustomContent.fromOfferRequest(request, account);
  }
}

export function createOfferFromNonSchemaData(data: any) {
  const request = createOfferRequest(data);
  return createOfferFromRequest(request, data.account);
}
