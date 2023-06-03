import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MailModule } from './providers/mailer/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ApiJwtModule } from './modules/api-jwt/api-jwt.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { TestingModule } from './providers/testing/testing.module';
import { PrismaModule } from './providers/prisma/prisma.module';
import { PostsModule } from './modules/posts/posts.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InboxEventsModule } from './providers/inboxEvents/inbox-events.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import LogsMiddleware from '@common/modules/logger/logs.middleware';
import { LoggerModule } from '@common/modules/logger/logger.module';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';

@Module({
  imports: [
    ApiConfigModule,
    MailModule,
    AuthModule,
    UsersModule,
    ApiJwtModule,
    SessionsModule,
    TestingModule,
    LoggerModule,
    PrismaModule,
    PostsModule,
    // PaymentsModule,
    EventEmitterModule.forRoot(),
    // SchedulerModule,
    InboxEventsModule,
    SuperAdminModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
