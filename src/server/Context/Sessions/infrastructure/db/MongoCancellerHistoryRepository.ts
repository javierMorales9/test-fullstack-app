import { CancellerHistoryRepository } from '../../domain/CancellerHistoryRepository';
import { CancellerHistory } from '../../domain/CancellerHistory';
import {
  CancellerHistoryModel,
  CancellerHistoryMongo,
} from './CancellerHistoryMongo';
import { transformToCancellerHistoryFromRepo } from './transformToCancellerHistoryFromRepo';
import logger from '../../../../Context/Shared/infrastructure/logger/logger';

export default class MongoCancellerHistoryRepository
  implements CancellerHistoryRepository
{
  public async getHistoryOfACanceller(
    cancellerId: string,
  ): Promise<CancellerHistory | null> {
    const cancellerHistory = await CancellerHistoryModel.findOne({
      cancellerId,
    });
    return transformToCancellerHistoryFromRepo(cancellerHistory);
  }

  public async saveCancellerHistory(
    canceller: CancellerHistory,
  ): Promise<void> {
    logger.debug('Adding a session to the canceller: ' + canceller.cancellerId);
    const cancellerMongo = createCancellerMongo(canceller);
    try {
      await CancellerHistoryModel.findOneAndUpdate(
        { _id: cancellerMongo._id },
        { $set: { ...cancellerMongo } },
        { upsert: true, new: true },
      );
      logger.debug('Canceller history saved request database');
    } catch (err) {
      handleCreationError(err, canceller);
      throw new Error();
    }
  }

  public async getTotalAndSavedUsers(
    accountId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ total: number; saved: number }> {
    startDate = startDate || new Date(1970, 0, 1);
    endDate = endDate || new Date();

    const totalAggregate = await CancellerHistoryModel.aggregate([
      {
        $addFields: {
          firstSession: {
            $last: '$sessionResults',
          },
        },
      },
      {
        $addFields: {
          date: '$firstSession.date',
        },
      },
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
          account: accountId,
        },
      },
      {
        $count: 'count',
      },
    ]);
    const total = totalAggregate[0] ? (totalAggregate[0].count as number) : 0;

    const savedAggregate = await CancellerHistoryModel.aggregate([
      {
        $addFields: {
          firstSession: {
            $last: '$sessionResults',
          },
        },
      },
      {
        $addFields: {
          date: '$firstSession.date',
        },
      },
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
          account: accountId,
          state: 'saved',
        },
      },
      {
        $count: 'count',
      },
    ]);
    const saved = savedAggregate[0] ? (savedAggregate[0].count as number) : 0;

    return { total, saved };
  }

  public async getCancellationReasonsStats(
    accountId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ _id: string; count: number }[]> {
    console.log(startDate, endDate);
    startDate = startDate || new Date(1970, 0, 1);
    endDate = endDate || new Date();

    const total = await CancellerHistoryModel.count();
    const result = (await CancellerHistoryModel.aggregate([
      {
        $addFields: {
          firstSession: {
            $last: '$sessionResults',
          },
        },
      },
      {
        $addFields: {
          date: '$firstSession.date',
        },
      },
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
          account: accountId,
        },
      },
      {
        $group: { _id: '$cancellationReason', count: { $sum: 1 } },
      },
      {
        $project: {
          count: {
            $multiply: [{ $divide: ['$count', { $literal: total }] }, 100],
          },
        },
      },
    ])) as unknown;

    return result as { _id: string; count: number }[];
  }

  public async getAccountBoostedRevenue(accountId: string): Promise<number> {
    const data = await CancellerHistoryModel.aggregate([
      {
        $match: {
          account: accountId,
        },
      },
      {
        $group: {
          _id: 'account',
          count: {
            $sum: '$boostedRevenue',
          },
        },
      },
    ]);

    const count = data[0]?.count || 0;
    return count as number;
  }

  public async increaseBoostedRevenueForAllSavedUsers(): Promise<void> {
    await CancellerHistoryModel.updateMany({ state: 'saved' }, [
      {
        $set: { boostedRevenue: { $sum: ['$boostedRevenue', '$ticket'] } },
      },
    ]);
  }

  public async getFlowsToUpdateAndTheCorrespondingAmount(): Promise<
    { flow: string; ticket: number }[]
  > {
    const result = (await CancellerHistoryModel.aggregate([
      {
        $match: {
          state: 'saved',
        },
      },
      {
        $addFields: {
          sessionData: {
            $last: '$sessionResults',
          },
        },
      },
      {
        $addFields: {
          session: '$sessionData.session',
        },
      },
      {
        $lookup: {
          from: 'sessions',
          localField: 'session',
          foreignField: '_id',
          as: 'session',
        },
      },
      {
        $addFields: {
          flow: '$session.flow',
        },
      },
      {
        $project: {
          flow: {
            $first: '$session.flow',
          },
          ticket: '$ticket',
        },
      },
    ])) as unknown;

    return result as { flow: string; ticket: number }[];
  }
}

function createCancellerMongo(
  canceller: CancellerHistory,
): CancellerHistoryMongo {
  return {
    _id: canceller.id,
    cancellerId: canceller.cancellerId,
    sessionResults: canceller.sessionResults,
    state: canceller.state,
    ticket: canceller.ticket,
    cancellationReason: canceller.cancellationReason,
    account: canceller.account,
    isResaved: canceller.isResaved,
    boostedRevenue: canceller.boostedRevenue,
  };
}

function handleCreationError(err: any, canceller: CancellerHistory) {
  logger.debug('Error while adding the history: ' + err.message);
  throw new Error(
    'CancellerHistory ' + canceller.cancellerId + ' could not be created',
  );
}
