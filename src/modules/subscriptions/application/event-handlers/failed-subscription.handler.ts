import { Injectable } from '@nestjs/common';
import { PaymentEventType } from '../../../../providers/payment/payment-event.type';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ISubscriptionsRepository } from '../../infrastructure/subscriptions.repository';
import { StripeEventType } from './success-subscription.handler';

@Injectable()
export class FailedSubscriptionHandler {
  private emitter: EventEmitter2;
  constructor(private eventEmitter: EventEmitter2, private readonly subscriptionsRepository: ISubscriptionsRepository) {
    this.emitter = eventEmitter;
  }

  @OnEvent(PaymentEventType.failedSubscription)
  async handle(event: StripeEventType) {
    console.log('FailedSubscriptionHandler', event);
    // find subscription where payments contains paymentSessionId
    const subscriptionEntity = await this.subscriptionsRepository.getSubscriptionByPaymentSessionId(
      event.data.object.id,
    );
    // update subscription status to active
    subscriptionEntity.changeStatusToFailing(event);
    //save subscription
    await this.subscriptionsRepository.saveSubscriptionWithPayment(subscriptionEntity);
  }
}
