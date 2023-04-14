import FlowRepository from '../domain/repos/FlowRepository';
import FlowNotFoundError from '../domain/errors/FlowNotFoundError';

export default class FlowActivator {
  constructor(private flowRepo: FlowRepository) {}

  async execute(flowId: string) {
    const flow = await this.flowRepo.getFlowById(flowId);
    if (!flow) throw new FlowNotFoundError();
    flow.activated = true;
    const savedFlow = await this.flowRepo.saveOrUpdate(flow);

    if (!savedFlow) throw new Error('Unable to activate the flow');

    return savedFlow;
  }
}
