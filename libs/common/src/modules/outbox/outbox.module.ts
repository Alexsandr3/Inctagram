import { Module } from '@nestjs/common';
import { OutboxProcessor } from '@common/modules/outbox/outbox.processor';
import { OutboxService } from '@common/modules/outbox/outbox.service';
import { IOutboxRepository, OutboxRepository } from '@common/modules/outbox/outbox.repository';
import { AmpqModule } from '@common/modules/ampq/ampq.module';

@Module({
  imports: [AmpqModule.forRootAsync()],
  providers: [
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
