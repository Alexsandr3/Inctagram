import { BaseDateEntity } from '../../../main/entities/base-date.entity';
import { Payment, Prisma } from '@prisma/client';
import { Currency } from '../types/currency';
import { PaymentStatus } from '../types/paymentStatus';

export class PaymentEntity extends BaseDateEntity implements Payment {
  id: number;
  sessionId: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  context: Prisma.JsonValue;
  subscriptionId: string;

  static create(sessionId: string, id: string, amount: number): PaymentEntity {
    const instancePayment = new PaymentEntity();
    instancePayment.id = null;
    instancePayment.sessionId = sessionId;
    instancePayment.amount = amount;
    instancePayment.currency = Currency.USD;
    instancePayment.status = PaymentStatus.PENDING;
    instancePayment.context = null;
    instancePayment.subscriptionId = id;
    return instancePayment;
  }
}
