import { BaseDateEntity } from '@common/main/entities/base-date.entity';
import { Payment } from '@prisma/client';
import { Currency } from '@common/main/types/currency';
import { PaymentStatus } from '@common/main/types/paymentStatus';

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

  changeStatusToSuccess(): PaymentEntity {
    this.status = PaymentStatus.SUCCESSFUL;
    return this;
  }

  changeStatusToFailing(): PaymentEntity {
    this.status = PaymentStatus.FAILED;
    return this;
  }
}
