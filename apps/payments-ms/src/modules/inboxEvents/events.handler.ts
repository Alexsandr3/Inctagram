import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentEventType } from '@common/main/payment-event.type';
import Stripe from 'stripe';
import { IInboxEventRepository } from '@payments-ms/modules/inboxEvents/inbox-event.repository';
import { InboxStripeEventEntity } from '@payments-ms/modules/inboxEvents/inbox-stripe-event.entity';

@Injectable()
export class EventsHandler {
  constructor(private readonly inboxEventRepository: IInboxEventRepository) {}

  @OnEvent(PaymentEventType.someOtherEvent)
  async handle(event: Stripe.Event) {
    //create event instance
    const instanceEvent = InboxStripeEventEntity.create(event.type, event);
    //save event
    await this.inboxEventRepository.create(instanceEvent);
  }
}
