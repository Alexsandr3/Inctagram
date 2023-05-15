import { Injectable } from '@nestjs/common';
import { CleanupRepository } from './cleanup.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubscriptionEventType } from '../../main/subscription-event.type';

@Injectable()
export class CleanupService {
  constructor(private readonly cleanupRepository: CleanupRepository, private readonly eventEmitter: EventEmitter2) {}

  async cleanupUnsuccessfulSubscriptions(tenMinuteAgo: Date) {
    //remove unsuccessful subscriptions with payment where status pending and created_at is older than 10 minutes
    await this.cleanupRepository.removeUnsuccessfulSubscriptions(tenMinuteAgo);
  }

  async checkActiveSubscriptions(currentDate: Date) {
    //find active subscriptions where endDate is equal to current date
    const subscriptions = await this.cleanupRepository.getActiveSubscriptionsWithPayments(currentDate);
    if (subscriptions.length === 0) {
      this.eventEmitter.emit(SubscriptionEventType.notExistingActiveSubscription, 'No active subscriptions found');
      return;
    }
    //update subscription status to inactive
    subscriptions.forEach(subscription => {
      subscription.updateFinishedSubscription();
    });
    //save subscriptions
    await this.cleanupRepository.saveSubscriptions(subscriptions);
  }
}
