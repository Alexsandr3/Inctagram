import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxProcessor } from '@common/modules/outbox/outbox.processor';

@Injectable()
export class EventTask {
  constructor(private readonly outboxProcessor: OutboxProcessor) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async handlerOutboxEvent(): Promise<void> {
    await this.outboxProcessor.handleOutboxEvent();
  }
}
