import FlowRepository from "../repos/FlowRepository";

export default class IncreaseFlowBoostedRevenueService {
  constructor(private flowRepo: FlowRepository) {}

  async execute(flowId: string, ticket: number) {
    const flow = await this.flowRepo.getFlowById(flowId);
    if (!flow) throw new Error();

    flow.increaseBoostedRevenue(ticket);

    await this.flowRepo.saveOrUpdate(flow);
  }
}
