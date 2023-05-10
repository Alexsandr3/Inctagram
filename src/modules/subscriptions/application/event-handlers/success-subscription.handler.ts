import { Injectable } from '@nestjs/common';
import { PaymentEventType } from '../../../../providers/payment/types/payment-event.type';
import { OnEvent } from '@nestjs/event-emitter';
import { ISubscriptionsRepository } from '../../infrastructure/subscriptions.repository';
import { StripeEventType } from '../../types/stripe-event.type';

@Injectable()
export class SuccessSubscriptionHandler {
  constructor(private readonly subscriptionsRepository: ISubscriptionsRepository) {}

  @OnEvent(PaymentEventType.successSubscription)
  async handle(event: StripeEventType) {
    // find subscription where payments contains paymentSessionId
    const subscriptionEntity = await this.subscriptionsRepository.getSubscriptionByPaymentSessionId(event.id);
    // update subscription status to active
    subscriptionEntity.changeStatusToActive(event);
    //save subscription
    await this.subscriptionsRepository.saveSubscriptionWithPayment(subscriptionEntity);
  }
}
