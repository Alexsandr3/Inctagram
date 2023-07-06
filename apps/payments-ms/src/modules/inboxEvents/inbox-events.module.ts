import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@common/modules/database/database.module';
import { InboxStripeEventEntity } from '@payments-ms/modules/inboxEvents/inbox-stripe-event.entity';
import { EventsHandler } from '@payments-ms/modules/inboxEvents/events.handler';
import { IInboxEventRepository, InboxEventRepository } from '@payments-ms/modules/inboxEvents/inbox-event.repository';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([InboxStripeEventEntity])],
  providers: [
    EventsHandler,
    {
      provide: IInboxEventRepository,
      useClass: InboxEventRepository,
    },
  ],
})
export class InboxEventsModule {}
