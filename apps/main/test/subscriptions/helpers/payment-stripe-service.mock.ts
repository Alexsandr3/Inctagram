import { SubscriptionType } from '@common/main/types/subscription.type';
import { Stripe } from 'stripe';
import { sessionForTestSubscription, sessionForTestSubscription2 } from './sessionForTestSubscription';
import { activeSubscriptionForTestSubscription } from './active.subcription.type';

export class PaymentStripeServiceMock {
  constructor() {}

  async deactivateLastActiveSubscription(customer: string, subscription: string): Promise<void> {
    return;
  }

  async createSession(params: {
    customerId: string;
    email: string;
    userName: string;
    subscriptionType: SubscriptionType;
  }): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    if (params.subscriptionType === SubscriptionType.MONTHLY) {
      return sessionForTestSubscription as Stripe.Response<Stripe.Checkout.Session>;
    }
    if (params.subscriptionType === SubscriptionType.YEARLY) {
      return sessionForTestSubscription2 as Stripe.Response<Stripe.Checkout.Session>;
    }
    return;
  }

  async findSubscriptions(customerId: string): Promise<Stripe.ApiListPromise<Stripe.Subscription>> {
    // @ts-ignore
    return activeSubscriptionForTestSubscription;
  }
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Response<Stripe.Subscription>> {
    return;
  }
}
