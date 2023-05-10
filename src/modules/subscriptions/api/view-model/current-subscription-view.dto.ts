export class CurrentSubscriptionViewModel {
  userId: number;
  customerId: string;
  dateOfPayment: Date;
  endDateOfSubscription: Date;

  constructor(userId: number, customerId: string, dateOfPayment: Date, endDateOfSubscription: Date) {
    this.userId = userId;
    this.customerId = customerId;
    this.dateOfPayment = dateOfPayment;
    this.endDateOfSubscription = endDateOfSubscription;
  }
}
