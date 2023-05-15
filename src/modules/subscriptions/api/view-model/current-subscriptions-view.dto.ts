export class ActiveSubscriptionViewModel {
  userId: number;
  subscriptionId: string;
  dateOfPayment: Date;
  endDateOfSubscription: Date;
  autoRenewal: boolean;

  constructor(userId: number, subscriptionId: string, dateOfPayment: Date, endDate: Date, autoRenewal: boolean) {
    this.userId = userId;
    this.subscriptionId = subscriptionId;
    this.dateOfPayment = dateOfPayment;
    this.endDateOfSubscription = endDate;
    this.autoRenewal = autoRenewal;
  }
}

export class CurrentActiveSubscriptionsViewModel {
  data: ActiveSubscriptionViewModel[];
  hasAutoRenewal: boolean;
  constructor(data: ActiveSubscriptionViewModel[]) {
    this.data = data;
    //if data has auto renewal true then set hasAutoRenewal to true
    this.hasAutoRenewal = data.some(sub => sub.autoRenewal);
  }
}
