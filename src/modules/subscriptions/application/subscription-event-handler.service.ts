import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ISubscriptionsRepository } from '../infrastructure/subscriptions.repository';
import { PaymentEventType } from '../../../main/payment-event.type';
import { StripeEventType } from '../types/stripe-event.type';
import { PaymentStripeService } from '../../../providers/payment/application/payment-stripe.service';
import { IUsersRepository } from '../../users/infrastructure/users.repository';

@Injectable()
export class SubscriptionEventHandlerService {
  constructor(
    private readonly subscriptionsRepository: ISubscriptionsRepository,
    private eventEmitter: EventEmitter2,
    private readonly paymentStripeService: PaymentStripeService,
    private readonly usersRepository: IUsersRepository,
  ) {}

  /**
   * Handle successful stripe event
   * @param event
   */
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
    currentSubscription.changeStatusToActive(event, currentPeriodEnd);
    await this.subscriptionsRepository.saveSubscriptionWithPayment(currentSubscription);
    //find the last active subscription by customer ID and deactivate it
    await this.paymentStripeService.deactivateLastActiveSubscription(event.customer, event.subscription);
    const user = await this.usersRepository.findById(currentSubscription.businessAccountId);
    //activate user - hasActiveBusinessAccount = true
    user.activateBusinessAccount();
    await this.usersRepository.updateExistingUser(user);
  }

  /**
   * Handle failed stripe event
   * @param event
   */
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
