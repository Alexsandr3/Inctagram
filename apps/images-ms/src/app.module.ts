import { MiddlewareConsumer, Module } from '@nestjs/common';
import LogsMiddleware from '@common/modules/logger/logs.middleware';
import { LoggerModule } from '@common/modules/logger/logger.module';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { AmpqModule } from '@common/modules/ampq/ampq.module';
import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';
import { EXCHANGE_IMAGES } from '@common/modules/ampq/ampq-contracts/exchanges/images.exchange';
import { ImagesModule } from '@images-ms/modules/images/images.module';
import { ChannelsModule } from '@images-ms/modules/channels/channels.module';
import { AppController } from '@images-ms/app.controller';

const AMPQ_EXCHANGES: RabbitMQExchangeConfig[] = [EXCHANGE_IMAGES];

@Module({
  imports: [ApiConfigModule, LoggerModule, ImagesModule, ChannelsModule, AmpqModule.forRoot(AMPQ_EXCHANGES)],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
