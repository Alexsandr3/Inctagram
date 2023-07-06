import { Module } from '@nestjs/common';
import { OutboxProcessor } from '@common/modules/outbox/outbox.processor';
import { OutboxService } from '@common/modules/outbox/outbox.service';
import { IOutboxRepository, OutboxRepository } from '@common/modules/outbox/outbox.repository';
import { AmpqModule } from '@common/modules/ampq/ampq.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventTask } from '@common/modules/outbox/event.task';

@Module({
  imports: [ScheduleModule.forRoot(), AmpqModule.forRootAsync()],
  providers: [
    EventTask,
    OutboxProcessor,
    OutboxService,
    {
      provide: IOutboxRepository,
      useClass: OutboxRepository,
    },
  ],
  exports: [OutboxProcessor],
})
export class OutboxModule {}
