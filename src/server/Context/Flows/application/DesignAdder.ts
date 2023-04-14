import FlowRepository from '../domain/repos/FlowRepository';
import { FlowDesign } from '../domain/FlowDesign';
import FlowNotFoundError from '../domain/errors/FlowNotFoundError';

export default class DesignAdder {
  constructor(private flowRepo: FlowRepository) {}

  async execute(flowId: string, design: FlowDesign) {
    const flow = await this.flowRepo.getFlowById(flowId);
    if (!flow) throw new FlowNotFoundError();
    flow.design = design;
    const savedFlow = await this.flowRepo.saveOrUpdate(flow);

    if (!savedFlow) throw new Error('Unable to add design to the flow');

    return savedFlow;
  }
}
