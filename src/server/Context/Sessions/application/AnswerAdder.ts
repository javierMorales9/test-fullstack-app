import { Session } from "../domain/session";
import { SessionRepository } from "../domain/SessionRepository";
import NextPageViewResolverService from "../domain/services/NextPageViewResolverService";
import AddSessionToCancellerHistoryService from "../domain/services/AddSessionToCancellerHistoryService";
import { View } from "../../Flows/domain/pages/views/View";
import logger from "../../../Context/Shared/infrastructure/logger/logger";
import { FinalView } from "../../Flows/domain/pages/views/FinalView";
import ApplyOfferService from "../../PaymentProviders/domain/services/ApplyOffersService";
import IncreaseFlowBoostedRevenueService from "../../Flows/domain/services/IncreaseFlowBoostedRevenueService";

export default class AnswerAdder {
  private session!: Session;

  constructor(
    private sessionRepository: SessionRepository,
    private applyOfferService: ApplyOfferService,
    private increaseFlowBoostedRevenueService: IncreaseFlowBoostedRevenueService,
    private addSessionToCancellerHistoryService: AddSessionToCancellerHistoryService,
  ) {}

  public async addAnswer(token: string, data?: any): Promise<View | null> {
    await this.populateSession(token);

    logger.info("Adding answer to session " + this.session.id);
    this.session.updateDate();
    this.session.completeLastAnswer(data);

    let nextPageView = await this.getNextPageView();
    if (nextPageView) await this.session.prepopulateAnswer(nextPageView);
    else if (!this.session.preview) {
      this.session.finish();
      nextPageView = new FinalView(this.session);
      await this.addSessionToCancellerHistoryService.execute(this.session);
      await this.increaseFlowBoostedRevenueService.execute(
        this.session.flow.id.value,
        this.session.userData.subscriptionPrice,
      );
      await this.applyOfferService.execute(
        this.session,
        this.session.flow.account.id.value,
      );
    } else {
      await this.sessionRepository.deleteById(this.session.id);
      return new FinalView(this.session);
    }

    await this.sessionRepository.save(this.session);

    logger.info("Answer added. The nextPageView is " + nextPageView?.id);
    return nextPageView;
  }

  private async populateSession(token: string) {
    const session = await this.sessionRepository.getByToken(token);

    if (!session)
      throw new Error("There is no session open with token: " + token);

    this.session = session;
  }

  private async getNextPageView() {
    const nextViewResolver = new NextPageViewResolverService(this.session);
    return nextViewResolver.resolve();
  }
}
