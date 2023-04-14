import { Page } from '../../Flows/domain/pages/Page';

export class IncorrectPageAnsweredError extends Error {
  constructor(page: Page, data: any) {
    super(
      'Answer should be done to ' +
        page.id +
        ', a ' +
        page.type +
        ', but instead was done to ' +
        data.page +
        ', a ' +
        data.type,
    );
  }
}
