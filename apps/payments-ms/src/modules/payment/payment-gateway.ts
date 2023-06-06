import { Injectable } from '@nestjs/common';
import { PaymentStripeService } from './application/payment-stripe.service';
import { PaymentMethod } from '@common/main/types/payment.method';
import { PaymentPaypalService } from './application/payment-paypal.service';
import {
  CreatedSessionResponseInterface,
  CreateSessionRequestInterface,
} from '@common/modules/ampq/ampq-contracts/queues/images/subscriptions.contract';
import { SubscriptionType } from '@common/main/types/subscription.type';

@Injectable()
export class PaymentGateway {
  constructor(
    private readonly paymentStripeService: PaymentStripeService,
    private readonly paymentPaypalService: PaymentPaypalService,
  ) {}

  /**
   * Create session for payment by payment type ['stripe', 'paypal']
   * @param data
   */
  async createSession(data: CreateSessionRequestInterface): Promise<CreatedSessionResponseInterface> {
    if (data.subscriptionInputData.paymentType === PaymentMethod.STRIPE) {
      return this.stripeMethod({
        customerId: data.customerId,
        email: data.email,
        userName: data.userName,
        subscriptionType: data.subscriptionInputData.typeSubscription,
      });
    }
    if (data.subscriptionInputData.paymentType === PaymentMethod.PAYPAL) {
      return this.paypalMethod({
        customerId: data.customerId,
        email: data.email,
        userName: data.userName,
        subscriptionType: data.subscriptionInputData.typeSubscription,
      });
    }
    return;
  }

  private async stripeMethod(data: {
    customerId: string;
    email: string;
    userName: string;
    subscriptionType: SubscriptionType;
  }): Promise<CreatedSessionResponseInterface> {
    const { customer, id, url } = await this.paymentStripeService.createSession({
      customerId: data.customerId,
      email: data.email,
      userName: data.userName,
      subscriptionType: data.subscriptionType,
    });
    return { customer, id, url } as CreatedSessionResponseInterface;
  }
  private async paypalMethod(data: {
    customerId: string;
    email: string;
    userName: string;
    subscriptionType: SubscriptionType;
  }): Promise<CreatedSessionResponseInterface> {
    const response = await this.paymentPaypalService.createSession({
      customerId: data.customerId,
      email: data.email,
      userName: data.userName,
      subscriptionType: data.subscriptionType,
    });
    return { customer: response.customer, id: response.id, url: response.url };
  }
}
