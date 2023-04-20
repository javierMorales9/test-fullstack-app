import { SessionRepository } from "../domain/SessionRepository";
import GetFlowByIdService from "../../Flows/domain/services/GetFlowByIdService";

export default class AllSessionsFromFlowGetter {
  public constructor(
    private sessionRepo: SessionRepository,
    private getFlowByIdService: GetFlowByIdService,
  ) {}

  public async getAll(flowId: string) {
    const flow = await this.getFlowByIdService.execute(flowId);
    if (!flow) throw new Error("Flow not found");

    return await this.sessionRepo.getAllFromFlow(flow.id.value);
  }
}
