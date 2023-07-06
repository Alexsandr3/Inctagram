import { Injectable } from '@nestjs/common';
import { IOutboxRepository } from '@common/modules/outbox/outbox.repository';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';

@Injectable()
export class OutboxService {
  constructor(private readonly outboxRepository: IOutboxRepository) {}

  async getPendingAndFailedOutboxEvents(): Promise<OutboxEventEntity[]> {
    return this.outboxRepository.getPendingAndFailedOutboxEvents();
  }

  async updateEvent(event: OutboxEventEntity): Promise<void> {
    return this.outboxRepository.updateEvent(event);
  }
}
