import { Session } from "../session";
import { CancellerHistoryRepository } from "../CancellerHistoryRepository";
import { CancellerHistory } from "../CancellerHistory";

export default class AddSessionToCancellerHistoryService {
  constructor(private cancellerHistoryRepo: CancellerHistoryRepository) {}

  public async execute(session: Session) {
    let canceller = await this.cancellerHistoryRepo.getHistoryOfACanceller(
      session.subscription,
    );

    if (canceller) canceller.addSession(session);
    else canceller = CancellerHistory.createNew(session);

    await this.cancellerHistoryRepo.saveCancellerHistory(canceller);
    return canceller;
  }
}
