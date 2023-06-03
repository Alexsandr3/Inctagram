import { Injectable } from '@nestjs/common';
import { PaymentStripeService } from './application/payment-stripe.service';
import { CreateSubscriptionInputDto } from '../../modules/subscriptions/api/input-dtos/create-subscription-input.dto';
import { SubscriptionType } from '../../modules/subscriptions/types/subscription.type';
import { PaymentMethod } from '../../modules/subscriptions/types/payment.method';
import { PaymentPaypalService } from './application/payment-paypal.service';

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
  async createSession(data: {
    customerId: string;
    email: string;
    userName: string;
    subscriptionType: CreateSubscriptionInputDto;
  }): Promise<any> {
    if (data.subscriptionType.paymentType === PaymentMethod.STRIPE) {
      return this.stripeMethod({
        customerId: data.customerId,
        email: data.email,
        userName: data.userName,
        subscriptionType: data.subscriptionType.typeSubscription,
      });
    }
    if (data.subscriptionType.paymentType === PaymentMethod.PAYPAL) {
      return this.paypalMethod({
        customerId: data.customerId,
        email: data.email,
        userName: data.userName,
        subscriptionType: data.subscriptionType.typeSubscription,
      });
    }
    return;
  }

  private async stripeMethod(data: {
    customerId: string;
    email: string;
    userName: string;
    subscriptionType: SubscriptionType;
  }): Promise<{ customer: string; id: string; url: string }> {
    const { customer, id, url } = await this.paymentStripeService.createSession({
      customerId: data.customerId,
      email: data.email,
      userName: data.userName,
      subscriptionType: data.subscriptionType,
    });
    return { customer, id, url } as { customer: string; id: string; url: string };
  }
  private async paypalMethod(data: {
    customerId: string;
    email: string;
    userName: string;
    subscriptionType: SubscriptionType;
  }): Promise<{ customer: string; id: string; url: string }> {
    const response = await this.paymentPaypalService.createSession({
      customerId: data.customerId,
      email: data.email,
      userName: data.userName,
      subscriptionType: data.subscriptionType,
    });
    return { customer: response.customer, id: response.id, url: response.url };
  }
}
