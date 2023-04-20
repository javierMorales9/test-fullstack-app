import { CancellerHistory } from "../../domain/CancellerHistory";

export function transformToCancellerHistoryFromRepo(
  entryCancellerHistory: any,
) {
  if (entryCancellerHistory == null) return null;

  const cancellerHistory = entryCancellerHistory._doc
    ? entryCancellerHistory._doc
    : entryCancellerHistory;

  return new CancellerHistory(
    cancellerHistory._id,
    cancellerHistory.cancellerId,
    cancellerHistory.sessionResults,
    cancellerHistory.state,
    cancellerHistory.ticket,
    cancellerHistory.cancellationReason,
    cancellerHistory.account,
    cancellerHistory.isResaved,
    cancellerHistory.boostedRevenue,
  );
}

export function transformToArrayOfCancellerHistoryFromRepo(
  historiesReceived: any[],
) {
  const cancellerHistories: CancellerHistory[] = [];

  for (const historyReceived of historiesReceived) {
    const historyParsed =
      transformToCancellerHistoryFromRepo(historiesReceived);

    if (historyParsed !== null) cancellerHistories.push(historyParsed);
  }

  return cancellerHistories;
}
