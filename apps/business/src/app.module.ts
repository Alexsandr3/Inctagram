import { MiddlewareConsumer, Module } from '@nestjs/common';
import LogsMiddleware from '@common/modules/logger/logs.middleware';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { LoggerModule } from '@common/modules/logger/logger.module';
import { AppController } from './app.controller';
import { PrismaModule } from '../../inctagram/src/providers/prisma/prisma.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtStrategy } from '@common/main/strategies/jwt.strategy';
import { SessionsModule } from '../../inctagram/src/modules/sessions/sessions.module';

@Module({
  imports: [
    ApiConfigModule,
    LoggerModule,
    PrismaModule,
    SubscriptionsModule,
    EventEmitterModule.forRoot(),
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
