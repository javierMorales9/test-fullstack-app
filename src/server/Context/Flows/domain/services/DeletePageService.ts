import { PageRepository } from '../repos/PageRepository';
import { Uuid } from '../../../../Context/Shared/domain/value-object/Uuid';

export default class DeletePageService {
  constructor(private pageRepo: PageRepository) {}

  async execute(pageId: string, accountId: Uuid) {
    await this.pageRepo.delete(pageId, accountId.value);
  }
}
