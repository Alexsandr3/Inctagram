import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '@payments-ms/modules/payment/domain/payment.entity';
import { PaymentStatus } from '@common/main/types/paymentStatus';

export abstract class IPaymentsRepository {
  abstract save(payment: Payment): Promise<Payment>;

  abstract getPaymentWithStatusPendingByPaymentSessionId(id: string): Promise<Payment>;
}

@Injectable()
export class PaymentsRepository implements IPaymentsRepository {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  getPaymentWithStatusPendingByPaymentSessionId(id: string): Promise<Payment> {
    return this.paymentsRepository.findOne({
      where: {
        paymentSessionId: id,
        status: PaymentStatus.PENDING,
      },
    });
  }

  save(payment: Payment): Promise<Payment> {
    return this.paymentsRepository.save(payment);
  }
}
