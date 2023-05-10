import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentEventType } from '../payment/types/payment-event.type';
import { StripeEventType } from '../../modules/subscriptions/types/stripe-event.type';
import { IInboxEventRepository } from './inbox-event.repository';

@Injectable()
export class EventsHandler {
  constructor(private readonly inboxEventRepository: IInboxEventRepository) {}

  @OnEvent(PaymentEventType.someOtherEvent)
  async handle(event: StripeEventType) {
    //save event
    await this.inboxEventRepository.create(event);
  }
}
