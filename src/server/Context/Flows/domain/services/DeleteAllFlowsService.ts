import FlowRepository from '../repos/FlowRepository';
import { Uuid } from '../../../../Context/Shared/domain/value-object/Uuid';
import DeleteFlowService from './DeleteFlowService';

export default class DeleteAllFlowsService {
  constructor(
    private flowRepo: FlowRepository,
    private deleteFlowService: DeleteFlowService,
  ) {}

  async execute(accountId: Uuid) {
    const flows = await this.flowRepo.getAllFlowsByAccountId(accountId.value);

    for (const flow of flows)
      await this.deleteFlowService.deleteFlow(flow, accountId);
  }
}
