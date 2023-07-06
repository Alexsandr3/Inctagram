import { Injectable } from '@nestjs/common';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { OutBoxEventType } from '@prisma/client';

export abstract class IOutboxRepository {
  abstract getPendingAndFailedOutboxEvents(): Promise<OutboxEventEntity[]>;

  abstract updateEvent(event: OutboxEventEntity): Promise<void>;
}

@Injectable()
export class OutboxRepository implements IOutboxRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPendingAndFailedOutboxEvents(): Promise<OutboxEventEntity[]> {
    //get all pending events with status pending and failed
    const events = await this.prisma.outBoxEvent.findMany({
      where: { statusEvent: { in: [OutBoxEventType.PENDING_FOR_BROKER, OutBoxEventType.FAILED_SEND_TO_BROKER] } },
    });
    return events.map(event => plainToInstance(OutboxEventEntity, event));
  }

  async updateEvent(event: OutboxEventEntity): Promise<void> {
    await this.prisma.outBoxEvent.update({
      where: { id: event.id },
      data: { statusEvent: event.statusEvent },
    });
  }
}
