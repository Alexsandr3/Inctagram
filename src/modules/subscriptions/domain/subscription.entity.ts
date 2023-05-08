import { Subscription } from '@prisma/client';
import { SubscriptionType } from '../types/subscription.type';
import { PaymentMethod } from '../types/payment.method';
import { Type } from 'class-transformer';
import { BaseDateEntity } from '../../../main/entities/base-date.entity';
import { PaymentEntity } from './payment.entity';
import { RenewalEntity } from './renewal.entity';
import { CreateSubscriptionInputDto } from '../api/input-dtos/create-subscription-input.dto';
import { StatusSubscriptionType } from './status-subscription.type';
import { randomUUID } from 'crypto';

export class SubscriptionEntity extends BaseDateEntity implements Subscription {
  id: string;
  businessAccountId: number;
  status: StatusSubscriptionType;
  dateOfPayment: Date;
  endDate: Date;
  type: SubscriptionType;
  price: number;
  paymentType: PaymentMethod;
  autoRenew: boolean;

  @Type(() => PaymentEntity)
  payments: PaymentEntity[];

  @Type(() => RenewalEntity)
  renewals: RenewalEntity[];

  constructor() {
    super();
  }

  static create(userId: number, createSubscriptionDto: CreateSubscriptionInputDto): SubscriptionEntity {
    const instance = new SubscriptionEntity();
    instance.id = randomUUID();
    instance.status = StatusSubscriptionType.PENDING;
    instance.dateOfPayment = null;
    instance.endDate = null;
    instance.type = createSubscriptionDto.typeSubscription;
    instance.price = createSubscriptionDto.amount;
    instance.paymentType = createSubscriptionDto.paymentType;
    instance.autoRenew = createSubscriptionDto.autoRenew;
    instance.businessAccountId = userId;
    instance.payments = [];
    instance.renewals = [];
    return instance;
  }
}
