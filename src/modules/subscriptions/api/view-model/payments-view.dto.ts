import { SubscriptionType } from '../../types/subscription.type';
import { PaymentMethod } from '../../types/payment.method';

export class PaymentsViewModel {
  userId: number;
  customerId: string;
  dateOfPayment: Date;
  endDateOfSubscription: Date;
  price: number;
  subscriptionType: SubscriptionType;
  paymentType: PaymentMethod;

  constructor(
    userId: number,
    customerId: string,
    dateOfPayment: Date,
    endDateOfSubscription: Date,
    price: number,
    subscriptionType: SubscriptionType,
    paymentType: PaymentMethod,
  ) {
    this.userId = userId;
    this.customerId = customerId;
    this.dateOfPayment = dateOfPayment;
    this.endDateOfSubscription = endDateOfSubscription;
    this.price = price;
    this.subscriptionType = subscriptionType;
    this.paymentType = paymentType;
  }
}
