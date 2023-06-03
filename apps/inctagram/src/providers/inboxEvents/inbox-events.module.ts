import { Module } from '@nestjs/common';
import { IInboxEventRepository, InboxEventRepository } from './inbox-event.repository';
import { EventsHandler } from './events.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboxStripeEventEntity } from './inbox-stripe-event.entity';
import { DatabaseModule } from '@common/modules/database/database.module';

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
