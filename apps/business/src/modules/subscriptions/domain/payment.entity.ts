import { BaseDateEntity } from '@common/main/entities/base-date.entity';
import { Payment } from '@prisma/client';
import { Currency } from '../types/currency';
import { PaymentStatus } from '../types/paymentStatus';
import { StripeEventType } from '../types/stripe-event.type';

export class PaymentEntity extends BaseDateEntity implements Payment {
  id: number;
  paymentSessionId: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  context: {};
  subscriptionId: string;

  static create(sessionId: string, id: string, amount: number): PaymentEntity {
    const instancePayment = new PaymentEntity();
    instancePayment.id = null;
    instancePayment.paymentSessionId = sessionId;
    instancePayment.amount = amount;
    instancePayment.currency = Currency.USD;
    instancePayment.status = PaymentStatus.PENDING;
    instancePayment.context = null;
    instancePayment.subscriptionId = id;
    return instancePayment;
  }

  changeStatusToSuccess(event: StripeEventType): PaymentEntity {
    this.status = PaymentStatus.SUCCESSFUL;
    this.context = event;
    return this;
  }

  changeStatusToFailing(event: StripeEventType): PaymentEntity {
    this.status = PaymentStatus.FAILED;
    this.context = event;
    return this;
  }
}
