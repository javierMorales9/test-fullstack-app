import { Flow } from "../domain/Flow";
import FlowRepository from "../domain/repos/FlowRepository";
import { Uuid } from "../../../Context/Shared/domain/value-object/Uuid";

export default class FlowsFromAccountGetter {
  constructor(private flowRepo: FlowRepository) {}

  async execute(accountId: Uuid, filterActivated?: boolean): Promise<Flow[]> {
    return await this.flowRepo.getAllFlowsByAccountId(
      accountId.value,
      filterActivated,
    );
  }
}
