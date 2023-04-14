import { AppConstants } from './AppConstants';
import AppConstantsRepo from './appConstantsRepo';
import { AppConstantsRepoImpl } from './AppConstantsRepoImpl';

class AppConstantsStore {
  private appConstants: AppConstants | null = null;

  constructor(private repo: AppConstantsRepo) {}

  public async init() {
    const constants = await this.repo.getAll();

    if (!constants) {
      const newAppConstants = new AppConstants(new Date());
      await this.repo.save(newAppConstants);
      this.appConstants = newAppConstants;
      return;
    }

    this.appConstants = constants;
  }

  public async get() {
    if (!this.appConstants) await this.init();
    return this.appConstants!;
  }

  public async updateBoostedRevenueDate(date: Date) {
    if (!this.appConstants) throw new Error('Not initialized');

    this.appConstants?.updateBoostedRevenueDate(date);
    await this.repo.save(this.appConstants);
  }
}

const appConstantRepo = new AppConstantsRepoImpl();
const appConstantStore = new AppConstantsStore(appConstantRepo);

export default appConstantStore;
