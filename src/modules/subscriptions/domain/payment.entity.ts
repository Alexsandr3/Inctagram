import { BaseDateEntity } from '../../../main/entities/base-date.entity';
import { Payment, Prisma } from '@prisma/client';
import { Currency } from '../types/currency';
import { PaymentStatus } from '../types/paymentStatus';

export class PaymentEntity extends BaseDateEntity implements Payment {
  id: number;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  context: Prisma.JsonValue;
  subscriptionId: string;

  static create() {
    const instancePayment = new PaymentEntity();
    // instancePayment.amount =
  }
}
