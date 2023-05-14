export class ActiveSubscriptionViewModel {
  userId: number;
  subscriptionId: string;
  dateStartOfSubscription: Date;
  endDateOfSubscription: Date;

  constructor(userId: number, subscriptionId: string, startDate: Date, endDate: Date) {
    this.userId = userId;
    this.subscriptionId = subscriptionId;
    this.dateStartOfSubscription = startDate;
    this.endDateOfSubscription = endDate;
  }
}

export class CurrentActiveSubscriptionsViewModel {
  data: ActiveSubscriptionViewModel[];
  constructor(data: ActiveSubscriptionViewModel[]) {
    this.data = data;
  }
}
