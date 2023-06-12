import { Injectable, Logger } from '@nestjs/common';
import { OutboxService } from '@common/modules/outbox/outbox.service';
import { OnEvent } from '@nestjs/event-emitter';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';
import { IRabbitProducer } from '@common/modules/ampq/rabbit.producer';

export const OUTBOX_EVENT = 'outbox';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  constructor(private readonly outboxService: OutboxService, private readonly rabbitProducer: IRabbitProducer) {}

  @OnEvent(OUTBOX_EVENT)
  async handleOutboxEvent(event: OutboxEventEntity) {
    this.logger.log(`Received event: ${JSON.stringify(event)}`);
    const events = await this.outboxService.getPendingAndFailedOutboxEvents();
    for (const event of events) {
      try {
        //send to rabbitmq
        await this.rabbitProducer.sendEvent(event);
        //update status to sent
        event.updateStatusToSent();
        //save event
        await this.outboxService.updateEvent(event);
      } catch (e) {
        //update status to failed
        event.updateStatusToFailed();
        //save event
        await this.outboxService.updateEvent(event);
        this.logger.error(`Error while sending event: ${JSON.stringify(event)}`);
        break;
      }
    }
  }
}
