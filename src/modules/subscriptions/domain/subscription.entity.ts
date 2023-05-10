import { Subscription } from '@prisma/client';
import { SubscriptionType } from '../types/subscription.type';
import { PaymentMethod } from '../types/payment.method';
import { Type } from 'class-transformer';
import { BaseDateEntity } from '../../../main/entities/base-date.entity';
import { PaymentEntity } from './payment.entity';
import { RenewalEntity } from './renewal.entity';
import { CreateSubscriptionInputDto } from '../api/input-dtos/create-subscription-input.dto';
import { StatusSubscriptionType } from './status-subscription.type';
import { StripeEventType } from '../types/stripe-event.type';

export class SubscriptionEntity extends BaseDateEntity implements Subscription {
  id: string;
  businessAccountId: number;
  customerId: string;
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
    subscription.customerId = null;
    subscription.payments = [];
    const payment = PaymentEntity.create(sessionId, subscription.id, createSubscriptionDto.amount);
    subscription.payments.push(payment);
    return { subscription, payment };
  }

  changeStatusToActive(event: StripeEventType) {
    this.status = StatusSubscriptionType.ACTIVE;
    this.dateOfPayment = new Date();
    this.customerId = event.customer;
    this.endDate = this.getEndDateSubscription();
    this.payments[0].changeStatusToSuccess(event);
    return this;
  }

  changeStatusToFailing(event: StripeEventType) {
    this.status = StatusSubscriptionType.DELETED;
    this.customerId = event.customer;
    this.payments[0].changeStatusToFailing(event);
    return this;
  }

  private getEndDateSubscription(): Date {
    if (this.type === SubscriptionType.MONTHLY) {
      return new Date(
        this.dateOfPayment.getFullYear(),
        this.dateOfPayment.getMonth() + 1,
        this.dateOfPayment.getDate(),
      );
    }
    if (this.type === SubscriptionType.SEMI_ANNUALLY) {
      return new Date(
        this.dateOfPayment.getFullYear(),
        this.dateOfPayment.getMonth() + 6,
        this.dateOfPayment.getDate(),
      );
    }

    if (this.type === SubscriptionType.YEARLY) {
      return new Date(
        this.dateOfPayment.getFullYear() + 1,
        this.dateOfPayment.getMonth(),
        this.dateOfPayment.getDate(),
      );
    }
  }
}
