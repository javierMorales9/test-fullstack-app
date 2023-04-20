import { Session } from "../session";
import logger from "../../../../Context/Shared/infrastructure/logger/logger";
import { View } from "../../../Flows/domain/pages/views/View";

export default class NextPageViewResolverService {
  private session: Session;
  private nextPageOrder;

  constructor(session: Session) {
    this.session = session;
    this.nextPageOrder = this.getLastAnsweredPageOrder();
    logger.debug("Created NextPageResolver");
  }

  public async resolve(): Promise<View | null> {
    logger.info("Started Resolving the Next Page");
    let nextView = null;

    while (!nextView && this.areThereRemainingPages()) {
      nextView = await this.getNextView();
    }

    return nextView;
  }

  private getLastAnsweredPageOrder() {
    const lastAnswer = this.session.answers[this.session.answers.length - 1];
    logger.info("Last page answer: " + lastAnswer?.page.id);

    return lastAnswer ? lastAnswer.page.order : 0;
  }

  private areThereRemainingPages() {
    return this.nextPageOrder <= this.session.answers.length + 1;
  }

  private async getNextView() {
    const nextPage = this.getThePageWithTheNextOrder();
    return nextPage
      ? await nextPage.generateView(
          this.session.answers,
          this.session.flow.account.id.value,
        )
      : null;
  }

  private getThePageWithTheNextOrder() {
    const nextPage = this.session.flow.getPageWithAnOrder(++this.nextPageOrder);
    logger.info("Page: " + nextPage?.id + " is returned");

    return nextPage;
  }
}
