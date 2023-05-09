import { BadRequestException, Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ApiConfigService } from '../../../modules/api-config/api.config.service';

@Injectable()
export class StripeService {
  private stripe = new Stripe(this.configService.API_KEY_STRIPE, { apiVersion: '2022-11-15' });
  private secretHook = this.configService.SECRET_HOOK_STRIPE;

  constructor(private readonly configService: ApiConfigService) {}

  async createCheckoutSession(signature: string | string[], body: Buffer) {
    try {
      const event = this.stripe.webhooks.constructEvent(body, signature, this.secretHook);
      console.log('-----event', event);
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        // console.log('-----session', session);
        // this.finishPaymentUseCase.excute(session.client_reference_id , event)
      }
      return event;
    } catch (e) {
      throw new BadRequestException(`Webhook error: ${e.message}`);
    }
  }

  async createBuy(productIds) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        success_url: 'http://localhost:5003/payments/stripe/success',
        cancel_url: 'http://localhost:5003/payments/stripe/cancel',
        line_items: [
          {
            price_data: {
              product_data: {
                name: `Buy subscription`,
                description: 'Subscription for 1 month',
              },
              unit_amount: 100 * 2.99,
              currency: 'USD',
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        client_reference_id: '123456789', //sample
      });
      return session;
    } catch (e) {
      console.log(e, 'error');
    }
  }

  async subscription(): Promise<any> {
    const priceId = 'price_1N5kAJIW91ghbnFj2bpYCefi';
    const priceId2 = 'price_1N5k8tIW91ghbnFjXZRpaEWq';

    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        customer: 'cus_NrTZwD9dUrjpCw',
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
}
