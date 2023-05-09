import { Subscription } from '@prisma/client';
import { SubscriptionType } from '../types/subscription.type';
import { PaymentMethod } from '../types/payment.method';
import { Type } from 'class-transformer';
import { BaseDateEntity } from '../../../main/entities/base-date.entity';
import { PaymentEntity } from './payment.entity';
import { RenewalEntity } from './renewal.entity';
import { CreateSubscriptionInputDto } from '../api/input-dtos/create-subscription-input.dto';
import { StatusSubscriptionType } from './status-subscription.type';

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

  static create(
    userId: number,
    createSubscriptionDto: CreateSubscriptionInputDto,
    sessionId: string,
  ): { subscription: SubscriptionEntity; payment: PaymentEntity } {
    const subscription = new SubscriptionEntity();
    subscription.status = StatusSubscriptionType.PENDING;
    subscription.dateOfPayment = null;
    subscription.endDate = null;
    subscription.type = createSubscriptionDto.typeSubscription;
    subscription.price = createSubscriptionDto.amount;
    subscription.paymentType = createSubscriptionDto.paymentType;
    subscription.autoRenew = createSubscriptionDto.autoRenew;
    subscription.businessAccountId = userId;
    // subscription.payments = [];
    const payment = PaymentEntity.create(sessionId, subscription.id, createSubscriptionDto.amount);
    // subscription.payments.push(payment);
    // subscription.renewals = [];
    return { subscription, payment };
  }
}
