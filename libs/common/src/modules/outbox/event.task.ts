import { Injectable } from '@nestjs/common';
import { OutboxProcessor } from '@common/modules/outbox/outbox.processor';

@Injectable()
export class EventTask {
  constructor(private readonly outboxProcessor: OutboxProcessor) {}

  // @Cron(CronExpression.EVERY_5_SECONDS)
  //todo: change to 5 minutes
  public async handlerOutboxEvent(): Promise<void> {
    await this.outboxProcessor.handleOutboxEvent();
  }
}
