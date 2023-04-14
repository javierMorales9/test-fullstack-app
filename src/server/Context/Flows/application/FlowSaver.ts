import FlowRepository from '../domain/repos/FlowRepository';
import { FlowRequest } from '../domain/pages/input/FlowRequest';
import { Flow } from '../domain/Flow';
import logger from '../../../Context/Shared/infrastructure/logger/logger';
import { Account } from '../../../Context/Accounts/domain/account';

export default class FlowSaver {
  constructor(private flowRepo: FlowRepository) {}

  public async execute(
    flowRequest: FlowRequest,
    account: Account,
  ): Promise<Flow> {
    logger.info('Saving Flow with name' + flowRequest.name + ' updated');

    const flowToUpdate = await Flow.fromRequest(flowRequest, account);
    const savedFlow = await this.flowRepo.saveOrUpdate(flowToUpdate);
    logger.debug('Flow returned from repo ' + savedFlow?.id);

    if (!savedFlow) throw new Error();

    logger.info('Saved Flow ' + savedFlow.id);

    return savedFlow;
  }
}
