import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ApiConfigService } from '../../../modules/api-config/api.config.service';
import { SubscriptionEntity } from '../../../modules/subscriptions/domain/subscription.entity';
import { CreateSubscriptionInputDto } from '../../../modules/subscriptions/api/input-dtos/create-subscription-input.dto';

@Injectable()
export class PaymentService {
  private stripe = new Stripe(this.configService.API_KEY_STRIPE, { apiVersion: '2022-11-15' });
  serverUrl: string;
  priceIdOnePaymentForOneMonth: string;
  priceIdSubscriptionMonthly: string;

  constructor(private readonly configService: ApiConfigService) {
    this.serverUrl = this.configService.CURRENT_APP_BASE_URL;
    this.priceIdOnePaymentForOneMonth = this.configService.PRICE_ID_MONTHLY;
    this.priceIdSubscriptionMonthly = this.configService.PRICE_ID_SUBSCRIPTION_MONTHLY;
  }

  public async createCustomer(name: string, email: string): Promise<string> {
    const customer = await this.stripe.customers.create({ name, email });
    return customer.id;
  }

  async subscription(): Promise<any> {
    const priceId = 'price_1N5kAJIW91ghbnFj2bpYCefi';
    const priceId2 = 'price_1N5k8tIW91ghbnFjXZRpaEWq';
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price: priceId2,
            // For metered billing, do not pass quantity
            quantity: 1,
          },
        ],
        // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
        // the actual Session ID is returned in the query parameter when your customer
        // is redirected to the success page.
        success_url: 'https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://example.com/canceled.html',
      });
      return session;
    } catch (e) {
      console.log(e, 'error');
    }
  }

  async createPaymentToSubscription(id: string, subscriptionEntity: SubscriptionEntity): Promise<any> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        customer: id,
        success_url: `${this.serverUrl}/payments/stripe/success`,
        cancel_url: `${this.serverUrl}/payments/stripe/cancel`,
        payment_method_types: ['card'],
        mode: 'payment',
        client_reference_id: id,
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
      });
      return session;
    } catch (e) {
      console.log(e, 'error');
    }
  }

  async createSession(stripeCustomerId: string, createSubscriptionDto: CreateSubscriptionInputDto) {
    const priceId = this.getPriceId(createSubscriptionDto);
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: createSubscriptionDto.autoRenew ? 'subscription' : 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            // For metered billing, do not pass quantity
            quantity: 1,
          },
        ],
        success_url: `${this.serverUrl}` + '/payments/stripe/success.html?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: `${this.serverUrl}/canceled.html`,
      });
      return session;
    } catch (e) {
      console.log(e, 'error');
    }
  }

  private getPriceId(createSubscriptionDto: CreateSubscriptionInputDto) {
    return createSubscriptionDto.autoRenew ? this.priceIdSubscriptionMonthly : this.priceIdOnePaymentForOneMonth;
  }
}
