import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BaseDateEntity } from '@common/main/entities/base-date.entity';
import { Currency } from '@common/main/types/currency';
import { PaymentStatus } from '@common/main/types/paymentStatus';
import { StripeEventType } from '@common/main/types/stripe-event.type';

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

  changeStatusToSuccess(event: StripeEventType): Payment {
    this.status = PaymentStatus.SUCCESSFUL;
    this.context = event;
    return this;
  }

  changeStatusToFailed(event: StripeEventType): Payment {
    this.status = PaymentStatus.FAILED;
    this.context = event;
    return this;
  }
}
