import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ISubscriptionsRepository } from '../infrastructure/subscriptions.repository';
import { PaymentEventType } from '../../../providers/payment/types/payment-event.type';
import { StripeEventType } from '../types/stripe-event.type';
import { SubscriptionEventType } from '../subscription-event.type';
import { PaymentStripeService } from '../../../providers/payment/application/payment-stripe.service';

@Injectable()
export class SubscriptionEventHandlerService {
  constructor(
    private readonly subscriptionsRepository: ISubscriptionsRepository,
    private eventEmitter: EventEmitter2,
    private readonly paymentStripeService: PaymentStripeService,
  ) {}

  @OnEvent(PaymentEventType.successSubscription)
  async handleSuccessfulStripeEvent(event: StripeEventType) {
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
      lastActiveSubscription.updateCurrentSubscriptionToInactive();
      await this.subscriptionsRepository.saveSubscriptionWithPayment(lastActiveSubscription);
    }
    //update subscription status to active
    currentSubscription.changeStatusToActive(event, currentPeriodEnd);
    // save subscription
    await this.subscriptionsRepository.saveSubscriptionWithPayment(currentSubscription);
    //find the last active subscription by customer ID and deactivate it
    await this.paymentStripeService.deactivateLastActiveSubscription(event.customer, event.subscription);
    //throw event subscription success for change status has active business account
    this.eventEmitter.emit(SubscriptionEventType.addActiveSubscription, currentSubscription);
  }

  @OnEvent(PaymentEventType.failedSubscription)
  async handleFailedSubscriptionEventFromStripe(event: StripeEventType) {
    // find subscription where payments contains paymentSessionId
    const subscriptionEntity = await this.subscriptionsRepository.getSubscriptionWithStatusPendingByPaymentSessionId(
      event.id,
    );
    // update subscription status to active
    subscriptionEntity.changeStatusToFailing(event);
    //save subscription
    await this.subscriptionsRepository.saveSubscriptionWithPayment(subscriptionEntity);
  }
}
