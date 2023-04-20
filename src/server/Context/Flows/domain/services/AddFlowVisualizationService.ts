import FlowRepository from "../repos/FlowRepository";

export default class AddFlowVisualizationService {
  constructor(private flowRepo: FlowRepository) {}

  async execute(id: string) {
    const flow = await this.flowRepo.getFlowById(id);

    if (!flow) return;

    flow.addVisualization();

    await this.flowRepo.saveOrUpdate(flow);
  }
}
