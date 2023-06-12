import { MiddlewareConsumer, Module } from '@nestjs/common';
import LogsMiddleware from '@common/modules/logger/logs.middleware';
import { LoggerModule } from '@common/modules/logger/logger.module';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { AmpqModule } from '@common/modules/ampq/ampq.module';
import { ImagesModule } from '@images-ms/modules/images/images.module';
import { ChannelsModule } from '@images-ms/modules/channels/channels.module';
import { AppController } from '@images-ms/app.controller';

@Module({
  imports: [ApiConfigModule, LoggerModule, ImagesModule, ChannelsModule, AmpqModule.forRootAsync()],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
