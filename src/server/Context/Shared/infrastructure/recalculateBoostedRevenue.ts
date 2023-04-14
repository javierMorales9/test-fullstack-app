/*
import { CancellerHistoryRepo } from '../session/domain/CancellerHistoryRepo';
import schedule from 'node-schedule';
import appConstantStore from './application_constants/AppConstantsStore';
import FlowRepo from '../flow/domain/repos/FlowRepo';
import container from '../../../dependency_injection';

export async function recalculateBoostedRevenue() {
  try {
    const lastDate = (await appConstantStore.get()).boostedRevenueDate;
    if (lastDate.getTime() < new Date().getTime()) {
      execute();

      const date = new Date();
      const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

      schedule.scheduleJob(newDate, execute);
      appConstantStore.updateBoostedRevenueDate(newDate);
    }
  } catch (err) {
    return;
  }
}

async function execute() {
  const cancellerRepo = container.resolve<CancellerHistoryRepo>(
    'CancellerHistoryRepo',
  );
  const flowRepo = container.resolve<FlowRepo>('FlowRepo');

  await cancellerRepo.increaseBoostedRevenueForAllSavedUsers();
  const updateFlowData =
    await cancellerRepo.getFlowsToUpdateAndTheCorrespondingAmount();
  await flowRepo.updateBoostedRevenue(updateFlowData);
}
*/
