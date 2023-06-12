// import { Injectable, Logger } from '@nestjs/common';
// import { OutboxService } from '@common/modules/outbox/outbox.service';
//
// @Injectable()
// export class OutboxPublisher {
//   private readonly logger = new Logger(OutboxPublisher.name);
//   constructor(private readonly outboxService: OutboxService) {}
//
//   async publish(event: object): Promise<void> {
//     await this.outboxService.create(event);
//   }
// }
