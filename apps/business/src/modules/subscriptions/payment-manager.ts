import { SubscriptionType } from './types/subscription.type';
import { PaymentMethod } from './types/payment.method';
import { Injectable } from '@nestjs/common';

interface IPaymentGateway {
  createSession(params: {
    customerId: string;
    email: string;
    userName: string;
    subscriptionType: SubscriptionType;
  }): Promise<any>;
}
@Injectable()
class PaymentGateway {
  adapter: Partial<Record<PaymentMethod, IPaymentGateway>> = {};

  constructor(stripeAdapter: IPaymentGateway, paypalAdapter: IPaymentGateway) {
    this.adapter[PaymentMethod.STRIPE] = stripeAdapter;
    this.adapter[PaymentMethod.PAYPAL] = paypalAdapter;
  }
  createSession(params: { customerId: string; email: string; userName: string; subscriptionType: SubscriptionType }) {
    return this.adapter[params.subscriptionType].createSession(params);
  }
}
