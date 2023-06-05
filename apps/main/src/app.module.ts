import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ApiJwtModule } from './modules/api-jwt/api-jwt.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { PostsModule } from './modules/posts/posts.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import LogsMiddleware from '@common/modules/logger/logs.middleware';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { ProvidersModule } from './providers/providers.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { AmpqModule } from '@common/modules/ampq/ampq.module';
import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';
import { EXCHANGE_IMAGES } from '@common/modules/ampq/ampq-contracts/exchanges/images.exchange';
import { EXCHANGE_SUBSCRIPTIONS } from '@common/modules/ampq/ampq-contracts/exchanges/subscriptions.exchange';

const AMPQ_EXCHANGES: RabbitMQExchangeConfig[] = [EXCHANGE_IMAGES, EXCHANGE_SUBSCRIPTIONS];

@Module({
  imports: [
    ApiConfigModule,
    AuthModule,
    UsersModule,
    ApiJwtModule,
    SessionsModule,
    PostsModule,
    // PaymentsModule,
    EventEmitterModule.forRoot(),
    SuperAdminModule,
    // RedirectModule,
    ProvidersModule,
    SubscriptionsModule,
    AmpqModule.forRoot(AMPQ_EXCHANGES),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
