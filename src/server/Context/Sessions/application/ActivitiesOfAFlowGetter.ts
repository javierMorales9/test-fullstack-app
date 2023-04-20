import { SessionRepository } from "../domain/SessionRepository";
import { validateDates } from "../../../Context/Shared/infrastructure/validateDates";

type UseCaseOptions = {
  startDate?: any;
  endDate?: any;
  page: number;
  length: number;
};

export default class ActivitiesOfAFlowGetter {
  constructor(private sessionRepo: SessionRepository) {}

  public async execute(flowId: string, options: UseCaseOptions) {
    const {
      startDate: incomingStartDate,
      endDate: incomingEndDate,
      page,
      length,
    } = options;

    let [startDate, endDate] = validateDates(
      incomingStartDate,
      incomingEndDate,
    );

    startDate = startDate || new Date(1970, 0, 1);
    endDate = endDate || new Date();

    const data = await this.sessionRepo.getAllFromFlowFiltered(
      flowId,
      startDate,
      endDate,
      page,
      length,
    );
    return {
      sessions: data.sessions.map((el) => {
        return {
          canceller: el.userData.userId,
          userData: el.userData,
          status: el.isFinished() ? "finished" : "in_progress",
          flowName: el.flow.name,
          flowId: el.flow.id.value,
          date: el.updatedAt,
          savedAmount: el.userData.subscriptionPrice,
        };
      }),
      count: data.count,
    };
  }
}
