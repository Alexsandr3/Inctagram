import { BadRequestException, Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ApiConfigService } from '../../../modules/api-config/api.config.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentEventType } from '../../../main/payment-event.type';

@Injectable()
export class StripePaymentWebhookService {
  private stripe = new Stripe(this.configService.API_KEY_STRIPE, { apiVersion: '2022-11-15' });
  private secretHook = this.configService.SECRET_HOOK_STRIPE;

  constructor(private readonly configService: ApiConfigService, private eventEmitter: EventEmitter2) {}

  async createEventSession(signature: string | string[], body: Buffer) {
    let data;
    let eventType;
    try {
      const event = this.stripe.webhooks.constructEvent(body, signature, this.secretHook);
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
      this.eventEmitter.emit(PaymentEventType.someOtherEvent, event);
      switch (eventType) {
        case 'checkout.session.completed':
          this.eventEmitter.emit(PaymentEventType.successSubscription, data);
          break;
        case 'invoice.paid':
          // Continue to provision the subscription as payments continue to be made.
          // Store the status in your database and check when a user accesses your service.
          // This approach helps you avoid hitting rate limits.
          break;
        case 'invoice.payment_failed':
          this.eventEmitter.emit(PaymentEventType.failedSubscription, data);
          break;
        default:
      }
      return;
    } catch (e) {
      throw new BadRequestException([{ message: 'Webhook Error', field: 'stripe' }]);
    }
  }

  /*

  async testCreateSession2() {
    // For a fully working example, please see:
    // https://github.com/paypal-examples/docs-examples/tree/main/standard-integration
    const { CLIENT_ID_PAYPAL, APP_SECRET_PAYPAL } = process.env;
    const auth = Buffer.from(CLIENT_ID_PAYPAL + ':' + APP_SECRET_PAYPAL).toString('base64');
    return await this.createOrder(auth);
  }
  async createOrder(auth: string) {
    const baseURL = {
      sandbox: 'https://api-m.sandbox.paypal.com',
      production: 'https://api-m.paypal.com',
    };
    const accessToken = await this.generateAccessToken(auth);
    const url = `${baseURL.sandbox}/v2/checkout/orders`;
    const response = await axios.post(
      url,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '23.00',
            },
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = response.data;
    return data;
  }

  async generateAccessToken(auth: string) {
    const baseURL = {
      sandbox: 'https://api-m.sandbox.paypal.com',
      production: 'https://api-m.paypal.com',
    };
    const response = await axios.post(`${baseURL.sandbox}/v1/oauth2/token`, 'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const data = response.data;
    return data.access_token;
  }*/
}
