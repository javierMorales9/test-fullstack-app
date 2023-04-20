import FlowRepository from "../repos/FlowRepository";

export default class GetTheDatesOfAFlowService {
  constructor(private flowRepo: FlowRepository) {}

  async execute(id: string) {
    return await this.flowRepo.getDates(id);
  }
}
