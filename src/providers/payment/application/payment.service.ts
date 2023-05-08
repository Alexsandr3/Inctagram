import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ApiConfigService } from '../../../modules/api-config/api.config.service';
import { SubscriptionEntity } from '../../../modules/subscriptions/domain/subscription.entity';

@Injectable()
export class PaymentService {
  private stripe = new Stripe(this.configService.API_KEY_STRIPE, { apiVersion: '2022-11-15' });
  serverUrl: string;

  constructor(private readonly configService: ApiConfigService) {
    this.serverUrl = this.configService.CURRENT_APP_BASE_URL;
  }

  public async createCustomer(name: string, email: string): Promise<Stripe.Response<Stripe.Customer>> {
    return this.stripe.customers.create({ name, email });
  }

  public async charge(amount: number, paymentMethodId: string, customerId: string) {
    return this.stripe.paymentIntents.create({
      amount,
      customer: customerId,
      payment_method: paymentMethodId,
      currency: 'usd',
      confirm: true,
    });
  }

  async createPaymentToSubscription(id: string, subscriptionEntity: SubscriptionEntity): Promise<any> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        success_url: `${this.serverUrl}/payments/stripe/success`,
        cancel_url: `${this.serverUrl}/payments/stripe/cancel`,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              product_data: {
                name: `Buy subscription`,
                description: 'Subscription for 1 month',
              },
              unit_amount: 100 * subscriptionEntity.price,
              currency: 'usd',
            },
            quantity: 1,
          },
        ],
        metadata: {
          subscriptionId: subscriptionEntity.id,
          customerId: id,
        },
        mode: 'payment',
        client_reference_id: id,
      });
      return session;
    } catch (e) {
      console.log(e, 'error');
    }
  }

  public async attachCreditCard(paymentMethodId: string, customerId: string) {
    return this.stripe.setupIntents.create({
      customer: customerId,
      payment_method: paymentMethodId,
    });
  }
}
