import { MiddlewareConsumer, Module } from '@nestjs/common';
import LogsMiddleware from '@common/modules/logger/logs.middleware';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { LoggerModule } from '@common/modules/logger/logger.module';
import { AppController } from '@payments-ms/app.controller';
import { InboxEventsModule } from '@payments-ms/modules/inboxEvents/inbox-events.module';
import { PaymentsModule } from '@payments-ms/modules/payment/payments.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChannelsModule } from '@payments-ms/modules/channels/channels.module';
import { OutboxModule } from '@common/modules/outbox/outbox.module';
import { PrismaModule } from '@common/modules/prisma/prisma.module';

@Module({
  imports: [
    ApiConfigModule,
    LoggerModule,
    PaymentsModule,
    InboxEventsModule,
    EventEmitterModule.forRoot(),
    OutboxModule,
    ChannelsModule,
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
