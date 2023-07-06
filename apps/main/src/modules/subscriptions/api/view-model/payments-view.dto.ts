import { SubscriptionType } from '@common/main/types/subscription.type';
import { PaymentMethod } from '@common/main/types/payment.method';

export class PaymentsViewModel {
  userId: number;
  subscriptionId: string;
  dateOfPayment: Date;
  endDateOfSubscription: Date;
  price: number;
  subscriptionType: SubscriptionType;
  paymentType: PaymentMethod;

  constructor(
    userId: number,
    subscriptionId: string,
    dateOfPayment: Date,
    endDateOfSubscription: Date,
    price: number,
    subscriptionType: SubscriptionType,
    paymentType: PaymentMethod,
  ) {
    this.userId = userId;
    this.subscriptionId = subscriptionId;
    this.dateOfPayment = dateOfPayment;
    this.endDateOfSubscription = endDateOfSubscription;
    this.price = price;
    this.subscriptionType = subscriptionType;
    this.paymentType = paymentType;
  }
}
