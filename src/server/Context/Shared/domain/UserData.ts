export class UserData {
  constructor(
    public readonly userId: string,
    public readonly plan: string,
    public readonly subscriptionPrice: number,
    public readonly billingInterval: 'day' | 'week' | 'month' | 'year',
    public readonly subscriptionAge: number,
    public readonly subscriptionStartDate: Date,
    public readonly subscriptionStatus:
      | 'active'
      | 'canceled'
      | 'incomplete'
      | 'incomplete_expired'
      | 'past_due'
      | 'trialing'
      | 'unpaid',
  ) {}

  public static createDefaultUserData() {
    return new UserData('', '', 0, 'month', 0, new Date(), 'active');
  }
}
