import { SessionRepository } from '../domain/SessionRepository';
import { Session } from '../domain/session';
import { Uuid } from '../../../Context/Shared/domain/value-object/Uuid';
import GetFlowByIdService from '../../Flows/domain/services/GetFlowByIdService';
import FlowNotFoundError from '../../Flows/domain/errors/FlowNotFoundError';

export default class PreviewSessionStarter {
  constructor(
    private sessionRepository: SessionRepository,
    private getFlowByIdService: GetFlowByIdService,
  ) {}

  public async execute(flowId: string, account: Uuid) {
    const flow = await this.getFlowByIdService.execute(flowId);
    if (!flow) throw new FlowNotFoundError();

    const session = new Session({ flow, preview: true });
    await this.sessionRepository.save(session);

    return {
      token: session.token,
      design: flow.getDesign(),
    };
  }
}
