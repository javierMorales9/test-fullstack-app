export class AppConstants {
  constructor(private _boostedRevenueDate: Date) {}

  public get boostedRevenueDate() {
    return this._boostedRevenueDate;
  }

  public updateBoostedRevenueDate(date: Date) {
    this._boostedRevenueDate = date;
  }
}
