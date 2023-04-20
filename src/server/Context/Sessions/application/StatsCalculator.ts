import { CancellerHistoryRepository } from "../domain/CancellerHistoryRepository";
import { Uuid } from "../../../Context/Shared/domain/value-object/Uuid";
import { validateDates } from "../../../Context/Shared/infrastructure/validateDates";

export default class StatsCalculator {
  constructor(private cancellerHistoryRepo: CancellerHistoryRepository) {}

  public async execute(
    accountId: Uuid,
    incomingStartDate?: any,
    incomingEndDate?: any,
  ) {
    const [startDate, endDate] = validateDates(
      incomingStartDate,
      incomingEndDate,
    );
    const { total, saved } =
      await this.cancellerHistoryRepo.getTotalAndSavedUsers(
        accountId.value,
        startDate,
        endDate,
      );
    const cancellationReasonsStats =
      await this.cancellerHistoryRepo.getCancellationReasonsStats(
        accountId.value,
        startDate,
        endDate,
      );

    const boostedRevenue =
      await this.cancellerHistoryRepo.getAccountBoostedRevenue(accountId.value);

    return {
      boostedRevenue: boostedRevenue,
      savedRatio: (saved / total) * 100 || 0,
      savedUsers: saved,
      cancelUsers: total - saved,
      cancellationReasonsStats,
    };
  }
}
