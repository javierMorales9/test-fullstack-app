import { SessionRepository } from "../SessionRepository";

export default class DeleteAllSessionsOfAFlowService {
  constructor(private sessionRepo: SessionRepository) {}

  public async execute(flowId: string): Promise<void> {
    await this.sessionRepo.deleteAllFromAFlow(flowId);
  }
}
