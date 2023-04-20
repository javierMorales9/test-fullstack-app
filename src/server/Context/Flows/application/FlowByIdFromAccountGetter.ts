import { Flow } from "../domain/Flow";
import FlowRepository from "../domain/repos/FlowRepository";
import FlowNotFoundError from "../domain/errors/FlowNotFoundError";
import { Uuid } from "../../../Context/Shared/domain/value-object/Uuid";

export default class FlowByIdFromAccountGetter {
  constructor(private flowRepo: FlowRepository) {}

  async getFlow(flowId: string, accountId: Uuid): Promise<Flow> {
    const flow = await this.flowRepo.getFlowByIdFromAccount(
      flowId,
      accountId.value,
    );

    if (!flow || flow.account.id.value !== accountId.value)
      throw new FlowNotFoundError();

    return flow;
  }
}
