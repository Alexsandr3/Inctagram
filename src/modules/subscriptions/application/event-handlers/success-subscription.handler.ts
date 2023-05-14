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
    // find current subscription with status pending
    const currentSubscription = await this.subscriptionsRepository.getSubscriptionWithStatusPendingByPaymentSessionId(
      event.id,
    );
    if (!currentSubscription) return;
    //find last created active subscription by customer id
    const lastActiveSubscription = await this.subscriptionsRepository.getLastActiveCreatedSubscriptionByCustomerId(
      currentSubscription.customerId,
    );
    let currentPeriodEnd;
    if (lastActiveSubscription) {
      currentPeriodEnd = lastActiveSubscription.endDate;
    }
    //update subscription status to active
    currentSubscription.changeStatusToActive(event, currentPeriodEnd);
    // save subscription
    await this.subscriptionsRepository.saveSubscriptionWithPayment(currentSubscription);
  }
}
