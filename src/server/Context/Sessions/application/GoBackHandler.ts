import { SessionRepository } from '../domain/SessionRepository';
import { Session } from '../domain/session';
import NextPageViewResolverService from '../domain/services/NextPageViewResolverService';
import logger from '../../../Context/Shared/infrastructure/logger/logger';
import { View } from '../../Flows/domain/pages/views/View';

export default class GoBackHandler {
  private session!: Session;

  constructor(private sessionRepository: SessionRepository) {}

  public async execute(token: string): Promise<View | null> {
    await this.populateSession(token);

    logger.info('Going back a page request session ' + this.session.id);
    this.session.deleteTheLastAnswer();

    const nextPageView = await this.getNextPageView();
    if (nextPageView) await this.session.prepopulateAnswer(nextPageView);

    await this.sessionRepository.save(this.session);

    logger.info('Answer added. The nextPageView is ' + nextPageView?.id);
    return nextPageView;
  }

  private async populateSession(token: string) {
    const session = await this.sessionRepository.getByToken(token);

    if (!session)
      throw new Error('There is no session open with token: ' + token);

    this.session = session;
  }

  private async getNextPageView() {
    const nextViewResolver = new NextPageViewResolverService(this.session);
    return nextViewResolver.resolve();
  }
}
