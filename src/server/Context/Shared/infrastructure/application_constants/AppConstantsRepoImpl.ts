import AppConstantsRepo from './appConstantsRepo';
import { AppConstants } from './AppConstants';
import { AppConstantsModel } from './AppConstantsMongo';

export class AppConstantsRepoImpl implements AppConstantsRepo {
  public async getAll(): Promise<AppConstants | null> {
    const document = await AppConstantsModel.findOne();
    if (!document) return null;

    return new AppConstants(document.boostedRevenueDate);
  }

  public async save(constants: AppConstants) {
    const document = await AppConstantsModel.findOne();
    if (!document) {
      await AppConstantsModel.create({
        boostedRevenueDate: constants.boostedRevenueDate,
      });
      return;
    }

    document.boostedRevenueDate = constants.boostedRevenueDate;
    await document.save();
  }
}
