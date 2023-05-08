import { BaseDateEntity } from '../../../main/entities/base-date.entity';
import { BusinessAccount } from '@prisma/client';
import { Type } from 'class-transformer';
import { SubscriptionEntity } from './subscription.entity';
import { CreateSubscriptionInputDto } from '../api/input-dtos/create-subscription-input.dto';

export class BusinessAccountEntity extends BaseDateEntity implements BusinessAccount {
  userId: number;
  @Type(() => SubscriptionEntity)
  subscription: SubscriptionEntity[];
  stripeCustomerId: string;

  constructor() {
    super();
  }

  static create(userId: number) {
    const instance = new BusinessAccountEntity();
    instance.userId = userId;
    instance.subscription = [];
    return instance;
  }

  createSubscription(createSubscriptionDto: CreateSubscriptionInputDto): SubscriptionEntity {
    const subscription = SubscriptionEntity.create(this.userId, createSubscriptionDto);
    this.subscription.push(subscription);
    return subscription;
  }

  addStripeCustomerId(id: string) {
    this.stripeCustomerId = id;
  }
}
