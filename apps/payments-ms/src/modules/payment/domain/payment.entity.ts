import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BaseDateEntity } from '@common/main/entities/base-date.entity';
import { Currency } from '@common/main/types/currency';
import { PaymentStatus } from '@common/main/types/paymentStatus';
import { StripeEventType } from '@common/main/types/stripe-event.type';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';
import {
  IFailedPaymentRequestInterface,
  ISuccessfulPaymentRequestInterface,
  PAYMENTS_CONTRACT,
} from '@common/modules/ampq/ampq-contracts/payments.contract';

@Entity()
export class Payment extends BaseDateEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  paymentSessionId: string;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ nullable: true, type: 'json' })
  context: object;

  @CreateDateColumn({ type: 'timestamp' })
  creationDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;

  static create(sessionId: string, amount: number): Payment {
    const instancePayment = new Payment();
    instancePayment.id = null;
    instancePayment.paymentSessionId = sessionId;
    instancePayment.amount = amount;
    instancePayment.currency = Currency.USD;
    instancePayment.status = PaymentStatus.PENDING;
    instancePayment.context = null;
    return instancePayment;
  }

  changeStatusToSuccess(inputEvent: StripeEventType, service: string): { payment: Payment; event: OutboxEventEntity } {
    this.status = PaymentStatus.SUCCESSFUL;
    this.context = inputEvent;
    const event = OutboxEventEntity.create<ISuccessfulPaymentRequestInterface>(
      null,
      service,
      PAYMENTS_CONTRACT.EVENTS.PAYMENTS.successfulPayment,
      {
        sessionId: inputEvent.id,
        customer: inputEvent.customer,
        subscription: inputEvent.subscription,
      },
    );
    return { payment: this, event };
  }

  changeStatusToFailed(inputEvent: StripeEventType, service: string): { payment: Payment; event: OutboxEventEntity } {
    this.status = PaymentStatus.FAILED;
    this.context = inputEvent;
    const event = OutboxEventEntity.create<IFailedPaymentRequestInterface>(
      null,
      service,
      PAYMENTS_CONTRACT.EVENTS.PAYMENTS.failedPayment,
      {
        customer: inputEvent.customer,
        sessionId: inputEvent.id,
      },
    );
    return { payment: this, event };
  }
}
