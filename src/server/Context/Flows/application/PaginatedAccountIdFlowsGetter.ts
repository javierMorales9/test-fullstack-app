import { Flow } from "../domain/Flow";
import FlowRepository from "../domain/repos/FlowRepository";

export default class PaginatedAccountIdFlowsGetter {
  constructor(private flowRepo: FlowRepository) {}

  async execute(
    accountId: string,
    page?: number,
    length?: number,
  ): Promise<{ flows: Flow[]; totalPages: number }> {
    const flows = await this.flowRepo.getFlowsByAccountIdPaginated(
      accountId,
      page,
      length,
    );
    const totalPages = await this.flowRepo.countAllFlows(accountId);
    return { flows, totalPages };
  }
}
