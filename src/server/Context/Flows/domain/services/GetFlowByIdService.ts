import FlowRepository from '../repos/FlowRepository';

export default class GetFlowByIdService {
  constructor(private flowRepo: FlowRepository) {}

  async execute(id: string) {
    return await this.flowRepo.getFlowById(id);
  }
}
