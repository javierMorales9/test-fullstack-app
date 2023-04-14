import { PageRequest } from './input/PageRequest';
import { Survey } from './Survey';
import { SurveyRequest } from './input/SurveyRequest';
import { OfferPage } from './OfferPage';
import { OfferPageRequest } from './input/OfferPageRequest';
import { Cancel } from './Cancel';
import { CancelRequest } from './input/CancelRequest';
import { Page } from './Page';
import { SurveyResponse } from './output/SurveyResponse';
import { OfferPageResponse } from './output/OfferPageResponse';
import { CancelResponse } from './output/CancelResponse';
import { PageResponse } from './output/PageResponse';
import { PageRepository } from '../repos/PageRepository';
import { TextAreaRequest } from './input/TextAreaRequest';
import { TextArea } from './TextArea';
import { TextAreaResponse } from './output/TextAreaResponse';
import PageNotFoundError from './errors/PageNotFoundError';
import container from "~/server/api/dependency_injection";

export function createPageRequest(data: any): PageRequest | null {
  if (!data.type) throw new Error('Bad page');

  switch (data.type) {
    case 'Survey':
    case 'survey':
      data.type = 'survey';
      return new SurveyRequest(data);

    case 'Offerpage':
    case 'offerpage':
      data.type = 'offerpage';
      return new OfferPageRequest(data);

    case 'Cancel':
    case 'cancel':
      data.type = 'cancel';
      return new CancelRequest(data);
    case 'Textarea':
    case 'textarea':
      data.type = 'textarea';
      return new TextAreaRequest(data);
    case 'Final':
    case 'final':
      return null;
    default:
      throw new Error('Incorrect data type: ' + data.type);
  }
}

export function createPageFromRequest(request: PageRequest | null) {
  if (!request) return null;

  switch (request.type) {
    case 'survey':
      return Survey.fromPageRequest(request);
    case 'offerpage':
      return OfferPage.fromPageRequest(request);
    case 'cancel':
      return Cancel.fromPageRequest(request);
    case 'textarea':
      return TextArea.fromPageRequest(request);
  }
}

export function createPageFromNonSchemaData(data: any) {
  const request = createPageRequest(data);
  return createPageFromRequest(request);
}

export function getPageByIdService(pageId: string) {
  const pageRepo = container.get<PageRepository>('Flows.domain.PageRepository');
  return pageRepo.getPageById(pageId).then((page) => {
    if (!page) throw new PageNotFoundError('Page not found');
    return page;
  });
}

export function createPageResponse(page: Page): PageResponse {
  switch (page.type) {
    case 'survey':
      return new SurveyResponse(page as Survey);
    case 'offerpage':
      return new OfferPageResponse(page as OfferPage);
    case 'cancel':
      return new CancelResponse(page as Cancel);
    case 'textarea':
      return new TextAreaResponse(page as TextArea);
    default:
      throw new Error('Incorrect page type');
  }
}
