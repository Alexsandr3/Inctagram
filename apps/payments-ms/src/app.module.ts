import { MiddlewareConsumer, Module } from '@nestjs/common';
import LogsMiddleware from '@common/modules/logger/logs.middleware';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { LoggerModule } from '@common/modules/logger/logger.module';
import { AmpqModule } from '@common/modules/ampq/ampq.module';
import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';
import { AppController } from '@payments-ms/app.controller';
import { InboxEventsModule } from '@payments-ms/modules/inboxEvents/inbox-events.module';
import { PaymentsModule } from '@payments-ms/modules/payment/payments.module';
import { EXCHANGE_PAYMENTS } from '@common/modules/ampq/ampq-contracts/exchanges/payments.exchange';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EXCHANGE_SUBSCRIPTIONS } from '@common/modules/ampq/ampq-contracts/exchanges/subscriptions.exchange';
import { ChannelsModule } from '@payments-ms/modules/channels/channels.module';

const AMPQ_EXCHANGES: RabbitMQExchangeConfig[] = [EXCHANGE_PAYMENTS, EXCHANGE_SUBSCRIPTIONS];
@Module({
  imports: [
    ApiConfigModule,
    LoggerModule,
    PaymentsModule,
    InboxEventsModule,
    EventEmitterModule.forRoot(),
    AmpqModule.forRoot(AMPQ_EXCHANGES),
    ChannelsModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
