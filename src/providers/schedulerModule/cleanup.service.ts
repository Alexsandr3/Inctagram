import { Injectable } from '@nestjs/common';
import { CleanupRepository } from './cleanup.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostsEventType } from '../../main/posts-event.type';
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
    console.log('subscriptions', subscriptions);
    if (subscriptions.length === 0) {
      return;
    }
    //update subscription status to inactive
    subscriptions.forEach(subscription => {
      subscription.updateFinishedSubscription();
      this.eventEmitter.emit(SubscriptionEventType.notExistingActiveSubscription, subscription.businessAccountId);
    });
    //save subscriptions
    await this.cleanupRepository.saveSubscriptions(subscriptions);
  }

  async removePostWithStatusDeleted(tenDaysAgo: Date) {
    //find posts with status deleted
    const posts = await this.cleanupRepository.getPostsWithStatusDeleted(tenDaysAgo);
    if (posts.length === 0) return;
    //find keys of images for delete from s3
    const keys = posts.reduce((imageUrls, post) => {
      return imageUrls.concat(post.images.map(image => image.url));
    }, []);
    //trigger event for delete images from s3
    this.eventEmitter.emit(PostsEventType.deleteImages, keys);
    //filter ids of posts
    const ids = posts.map(post => post.id);
    //remove posts by ids
    await this.cleanupRepository.removePostsByIds(ids);
  }

  async removeExpiredSessions(currentDate: number) {
    //need delete sessions if exp date less than current date
    await this.cleanupRepository.removeExpiredSessions(currentDate);
  }
}
