import { MiddlewareConsumer, Module } from '@nestjs/common';
import LogsMiddleware from '@common/modules/logger/logs.middleware';
import { ImagesModule } from './modules/images/images.module';
import { LoggerModule } from '@common/modules/logger/logger.module';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { AppController } from './app.controller';

@Module({
  imports: [ApiConfigModule, LoggerModule, ImagesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
