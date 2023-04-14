import FlowRepository from '../repos/FlowRepository';
import { Flow } from '../Flow';
import DeletePageService from './DeletePageService';
import { Uuid } from '../../../../Context/Shared/domain/value-object/Uuid';
import DeleteAllSessionsOfAFlowService from '../../../Sessions/domain/services/DeleteAllSessionsOfAFlowService';

export default class DeleteFlowService {
  constructor(
    private flowRepo: FlowRepository,
    private deletePageService: DeletePageService,
    private deleteAllSessionsOfAFlowService: DeleteAllSessionsOfAFlowService,
  ) {}

  async deleteFlow(flow: Flow, accountId: Uuid) {
    await this.deleteAllSessionsOfAFlowService.execute(flow.id.value);

    for (const page of flow.pages) {
      await this.deletePageService.execute(page.id, accountId);
    }

    await this.flowRepo.delete(flow.id.value, accountId.value);
  }
}
