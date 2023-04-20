import { SessionInitializerRequest } from "../domain/request/sessionInitializerRequest";
import ResolveFlowService from "../domain/services/ResolveFlowService";
import { Session } from "../domain/session";
import { SessionRepository } from "../domain/SessionRepository";
import { Uuid } from "../../../Context/Shared/domain/value-object/Uuid";
import logger from "../../../Context/Shared/infrastructure/logger/logger";
import GetUserDataService from "../../PaymentProviders/domain/services/GetUserDataService";

export default class SessionInitializer {
  constructor(
    private sessionRepository: SessionRepository,
    private getUserDataService: GetUserDataService,
    private resolveFlowService: ResolveFlowService,
  ) {}

  public async initializeSession(
    sessionInitializer: SessionInitializerRequest,
    account: Uuid,
  ) {
    console.log("The account" + account.value);

    logger.info(
      "Initializing session for " +
        sessionInitializer.userId +
        "from Account" +
        account.value,
    );

    const paymentType = sessionInitializer.paymentType || "stripe";
    const userData = await this.getUserDataService.execute(
      sessionInitializer.userId,
      account.value,
      paymentType,
    );
    const flow = await this.resolveFlowService.execute(
      userData,
      account.value,
      paymentType,
    );

    const session = new Session({
      flow,
      subscription: userData.userId,
      userData,
    });

    await this.sessionRepository.save(session);

    return {
      token: session.token,
      design: flow.getDesign(),
    };
  }
}
