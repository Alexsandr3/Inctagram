import { Injectable } from '@nestjs/common';
import { NestDataLoader } from 'nestjs-dataloader';
import DataLoader from 'dataloader';
import { SubscriptionForSuperAdminViewModel } from './api/models/subscription-for-super-admin-view.model';
import { ISubscriptionsRepository } from '../subscriptions/infrastructure/subscriptions.repository';

@Injectable()
export class SubscriptionLoader implements NestDataLoader<number, SubscriptionForSuperAdminViewModel[]> {
  constructor(private readonly subscriptionsRepository: ISubscriptionsRepository) {}
  generateDataLoader(): DataLoader<number, SubscriptionForSuperAdminViewModel[]> {
    return new DataLoader<number, SubscriptionForSuperAdminViewModel[]>(async (userIds: number[]) => {
      const subscriptions = await this.subscriptionsRepository.getSubscriptionForSuperAdmin(userIds);
      return userIds.map(userId => subscriptions.filter(sub => sub.ownerId === userId));
    });
  }
}
