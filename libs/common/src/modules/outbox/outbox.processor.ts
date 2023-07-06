import { Injectable, Logger } from '@nestjs/common';
import { OutboxService } from '@common/modules/outbox/outbox.service';
import { IRabbitProducer } from '@common/modules/ampq/rabbit.producer';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  constructor(private readonly outboxService: OutboxService, private readonly rabbitProducer: IRabbitProducer) {}

  async handleOutboxEvent() {
    const events = await this.outboxService.getPendingAndFailedOutboxEvents();
    if (!events.length) return;
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
