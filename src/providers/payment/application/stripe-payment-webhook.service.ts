import { BadRequestException, Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ApiConfigService } from '../../../modules/api-config/api.config.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentEventType } from '../payment-event.type';

@Injectable()
export class StripePaymentWebhookService {
  private stripe = new Stripe(this.configService.API_KEY_STRIPE, { apiVersion: '2022-11-15' });
  private secretHook = this.configService.SECRET_HOOK_STRIPE;

  constructor(private readonly configService: ApiConfigService, private eventEmitter: EventEmitter2) {}

  async createEventSession(signature: string | string[], body: Buffer) {
    let data: Stripe.Event.Data;
    let eventType;
    try {
      const event = this.stripe.webhooks.constructEvent(body, signature, this.secretHook);
      // Extract the object from the event.
      data = event.data;
      eventType = event.type;
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
      return event;
    } catch (e) {
      throw new BadRequestException([{ message: 'Webhook Error', field: 'stripe' }]);
    }
  }
}
