import { SubscriptionType } from '../../src/modules/subscriptions/types/subscription.type';
import { Stripe } from 'stripe';
import { sessionTestType } from './session.test.type';
import { activeSubscriptionType } from './active.subcription.type';

export class PaymentStripeServiceMock {
  constructor(e) {}

  async deactivateLastActiveSubscription(customer: string, subscription: string): Promise<void> {
    return;
  }

  async createSession(params: {
    customerId: string;
    email: string;
    userName: string;
    subscriptionType: SubscriptionType;
  }): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    return sessionTestType as Stripe.Response<Stripe.Checkout.Session>;
  }

  async findSubscriptions(customerId: string): Promise<Stripe.ApiListPromise<Stripe.Subscription>> {
    // @ts-ignore
    return activeSubscriptionType;
  }
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Response<Stripe.Subscription>> {
    return;
  }
}
