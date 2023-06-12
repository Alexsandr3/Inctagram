import { Subscription } from '@prisma/client';
import { SubscriptionType } from '@common/main/types/subscription.type';
import { PaymentMethod } from '@common/main/types/payment.method';
import { Type } from 'class-transformer';
import { BaseDateEntity } from '@common/main/entities/base-date.entity';
import { PaymentEntity } from './payment.entity';
import { RenewalEntity } from './renewal.entity';
import { CreateSubscriptionInputDto } from '../api/input-dtos/create-subscription-input.dto';
import { StatusSubscriptionType } from '@common/main/types/status-subscription.type';
import { PaymentEventSuccess } from '../application/subscriptions-event-handler';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';
import { AMPQ_CONTRACT } from '@common/modules/ampq/ampq-contracts/ampq.contract';

export class SubscriptionEntity extends BaseDateEntity implements Subscription {
  id: string;
  externalSubId: string;
  businessAccountId: number;
  customerId: string;
  status: StatusSubscriptionType;
  dateOfPayment: Date;
  startDate: Date;
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

  static createSubscriptionWithPayment(
    userId: number,
    customerId: string,
    createSubscriptionDto: CreateSubscriptionInputDto,
    sessionId: string,
  ) {
    const subscription = new SubscriptionEntity();
    subscription.id = null;
    subscription.externalSubId = null;
    subscription.businessAccountId = userId;
    subscription.customerId = customerId;
    subscription.status = StatusSubscriptionType.PENDING;
    subscription.dateOfPayment = null;
    subscription.startDate = null;
    subscription.endDate = null;
    subscription.type = createSubscriptionDto.typeSubscription;
    subscription.price = createSubscriptionDto.amount;
    subscription.paymentType = createSubscriptionDto.paymentType;
    subscription.autoRenew = true;
    subscription.payments = [];
    const payment = PaymentEntity.create(sessionId, subscription.id, createSubscriptionDto.amount);
    subscription.payments.push(payment);
    return subscription;
  }

  changeStatusToActive(
    inputEvent: PaymentEventSuccess,
    current_period_end: Date,
    senderService: string,
  ): { subscription: SubscriptionEntity; event: OutboxEventEntity } {
    this.externalSubId = inputEvent.subscription;
    this.status = StatusSubscriptionType.ACTIVE;
    this.dateOfPayment = new Date();
    this.startDate = current_period_end ? current_period_end : this.dateOfPayment;
    this.customerId = inputEvent.customer;
    this.endDate = this.getEndDateSubscription();
    this.payments[0].changeStatusToSuccess();
    const event = OutboxEventEntity.create(
      this.businessAccountId,
      senderService,
      AMPQ_CONTRACT.EVENTS.SUBSCRIPTIONS.deactivateLastActiveSubscription,
      {
        customerId: this.customerId,
        subscriptionId: this.id,
      },
    );
    return { subscription: this, event };
  }

  changeStatusToFailing(customer: string, sessionId: string) {
    this.externalSubId = sessionId;
    this.status = StatusSubscriptionType.DELETED;
    this.customerId = customer;
    this.payments[0].changeStatusToFailing();
    return this;
  }

  private getEndDateSubscription(): Date {
    if (this.type === SubscriptionType.MONTHLY) {
      return new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 1, this.startDate.getDate());
    }
    if (this.type === SubscriptionType.SEMI_ANNUALLY) {
      return new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 6, this.startDate.getDate());
    }

    if (this.type === SubscriptionType.YEARLY) {
      return new Date(this.startDate.getFullYear() + 1, this.startDate.getMonth(), this.startDate.getDate());
    }
  }

  disableAutoRenewal() {
    if (this.autoRenew) {
      this.autoRenew = false;
      return this;
    }
    return this;
  }

  updateFinishedSubscription() {
    if (this.endDate < new Date()) {
      this.status = StatusSubscriptionType.FINISHED;
      this.autoRenew = false;
      return this;
    }
    return this;
  }
}
