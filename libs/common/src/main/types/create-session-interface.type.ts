import { SubscriptionType } from '@common/main/types/subscription.type';
import { PaymentMethod } from '@common/main/types/payment.method';

export interface CreateSubscriptionInterface {
  typeSubscription: SubscriptionType;
  paymentType: PaymentMethod;
  amount: number;
}

export interface CreateSessionRequestInterface {
  customerId: string;
  email: string;
  userName: string;
  subscriptionInputData: CreateSubscriptionInterface;
}
