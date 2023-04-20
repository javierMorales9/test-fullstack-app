import { Flow } from "../domain/Flow";
import FlowRepository from "../domain/repos/FlowRepository";
import FlowNotFoundError from "../domain/errors/FlowNotFoundError";

export default class FlowByIdGetter {
  constructor(private flowRepo: FlowRepository) {}

  async getFlowById(id: string): Promise<Flow> {
    const response = await this.flowRepo.getFlowById(id);

    if (!response) throw new FlowNotFoundError();

    return response;
  }
}
