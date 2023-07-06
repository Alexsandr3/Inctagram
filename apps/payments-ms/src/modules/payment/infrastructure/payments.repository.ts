import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '@payments-ms/modules/payment/domain/payment.entity';
import { PaymentStatus } from '@common/main/types/paymentStatus';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';
import { PrismaService } from '@common/modules/prisma/prisma.service';

export abstract class IPaymentsRepository {
  abstract save(payment: Payment, event?: OutboxEventEntity): Promise<Payment>;

  abstract getPaymentWithStatusPendingByPaymentSessionId(id: string): Promise<Payment>;
}

@Injectable()
export class PaymentsRepository implements IPaymentsRepository {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private readonly prisma: PrismaService,
  ) {}

  async getPaymentWithStatusPendingByPaymentSessionId(id: string): Promise<Payment> {
    return this.paymentsRepository.findOne({
      where: {
        paymentSessionId: id,
        status: PaymentStatus.PENDING,
      },
    });
  }

  async save(payment: Payment, event?: OutboxEventEntity): Promise<Payment> {
    if (event) {
      await this.prisma.outBoxEvent.create({
        data: {
          senderService: event.senderService,
          eventName: event.eventName,
          payload: event.payload,
        },
      });
    }
    return this.paymentsRepository.save(payment);
  }
}
