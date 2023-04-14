import { CancellerHistory } from './CancellerHistory';

export interface CancellerHistoryRepository {
  getHistoryOfACanceller: (
    cancellerId: string,
  ) => Promise<CancellerHistory | null>;
  saveCancellerHistory: (canceller: CancellerHistory) => Promise<void>;

  getTotalAndSavedUsers(
    accountId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ total: number; saved: number }>;

  getCancellationReasonsStats(
    accountId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ _id: string; count: number }[]>;

  getAccountBoostedRevenue(id: string): Promise<number>;

  increaseBoostedRevenueForAllSavedUsers: () => Promise<void>;
  getFlowsToUpdateAndTheCorrespondingAmount: () => Promise<
    { flow: string; ticket: number }[]
  >;
}
