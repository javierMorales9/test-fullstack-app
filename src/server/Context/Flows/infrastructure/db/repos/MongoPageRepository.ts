import { PageModel } from '../models/pageMongo';
import { SurveyModel } from '../models/surveyMongo';
import { PageRepository } from '../../../domain/repos/PageRepository';
import { transformToPageFromRepo } from './transformToArrayOfPagesFromRepo';
import { CancelModel } from '../models/cancelMongo';
import { OfferPageModel } from '../models/offerPageMongo';
import { Page } from '../../../domain/pages/Page';
import { TextAreaModel } from '../models/textAreaMongo';
import logger from '../../../../../Context/Shared/infrastructure/logger/logger';
import PageAlreadyExistError from '../../../domain/pages/errors/PageAlreadyExistError';
import PageCouldNotBeCreated from '../../../domain/pages/errors/PageCouldNotBeCreated';

export default class MongoPageRepository implements PageRepository {
  public async getPageById(id: string): Promise<Page | null> {
    const response = await PageModel.findById(id);
    return transformToPageFromRepo(response);
  }

  public async savePages(pages: Page[]): Promise<Page[]> {
    const createdPages: Page[] = [];

    for (const page of pages) {
      const createdPage = await this.savePage(page);

      if (createdPage) createdPages.push(createdPage);
    }

    return createdPages;
  }

  public async savePage(page: Page): Promise<Page | null> {
    let savedPage: any;

    logger.debug('PageRepoImpl, saving page of type: ' + page.type);

    try {
      if (page.type === 'survey')
        savedPage = await SurveyModel.findOneAndUpdate(
          { _id: page.id },
          { $set: { ...page } },
          { upsert: true, new: true },
        );

      if (page.type === 'offerpage')
        savedPage = await OfferPageModel.findOneAndUpdate(
          { _id: page.id },
          { $set: { ...page } },
          { upsert: true, new: true },
        );

      if (page.type === 'cancel')
        savedPage = await CancelModel.findOneAndUpdate(
          { _id: page.id },
          { $set: { ...page } },
          { upsert: true, new: true },
        );

      if (page.type === 'textarea')
        savedPage = await TextAreaModel.findByIdAndUpdate(
          { _id: page.id },
          { $set: { ...page } },
          { upsert: true, new: true },
        );

      return transformToPageFromRepo(savedPage);
    } catch (err: any) {
      logger.debug('Unable to save the page. Reason: ' + err.message);
      MongoPageRepository.handlePageCreation(err, page);
      throw new Error('This error will never be thrown');
    }
  }

  public async delete(pageId: string): Promise<void> {
    logger.info('Deleting the page ' + pageId + ' from mongo');

    try {
      await PageModel.deleteOne({ _id: pageId }, { upsert: true, new: true });
    } catch (err: any) {
      logger.info('Error deleting the page: ' + err.message);
      throw new Error('Error deleting the page ' + pageId);
    }
  }

  private static handlePageCreation(err: any, page: Page) {
    const errMessage = err.message as string;

    if (errMessage.includes('duplicate key error'))
      throw new PageAlreadyExistError(page.id);

    throw new PageCouldNotBeCreated(page.id);
  }
}
