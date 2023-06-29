import { Injectable } from '@nestjs/common';
import { OutboxProcessor } from '@common/modules/outbox/outbox.processor';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EventTask {
  constructor(private readonly outboxProcessor: OutboxProcessor) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async handlerOutboxEvent(): Promise<void> {
    await this.outboxProcessor.handleOutboxEvent();
  }
}
