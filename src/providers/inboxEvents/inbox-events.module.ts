import { Module } from '@nestjs/common';
import { IInboxEventRepository, InboxEventRepository } from './inbox-event.repository';
import { EventsHandler } from './events.handler';

@Module({
  providers: [
    EventsHandler,
    {
      provide: IInboxEventRepository,
      useClass: InboxEventRepository,
    },
  ],
})
export class InboxEventsModule {}
