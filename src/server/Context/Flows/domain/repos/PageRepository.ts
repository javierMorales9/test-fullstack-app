import { Page } from '../pages/Page';

export interface PageRepository {
  getPageById(id: string): Promise<Page | null>;
  savePages: (pages: Page[]) => Promise<Page[]>;
  savePage: (page: Page) => Promise<Page | null>;
  delete: (pageId: string, accountId: string) => Promise<void>;
}
