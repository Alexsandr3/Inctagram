import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiConfigModule } from './modules/api-config/api.config.module';
import { MailModule } from './providers/mailer/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ApiJwtModule } from './modules/api-jwt/api-jwt.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { TestingModule } from './providers/testing/testing.module';
import { LoggerModule } from './providers/logger/logger.module';
import LogsMiddleware from './providers/logger/logs.middleware';
import { PrismaModule } from './providers/prisma/prisma.module';

@Module({
  imports: [
    ApiConfigModule,
    MailModule,
    AuthModule,
    UsersModule,
    ApiJwtModule,
    SessionsModule,
    TestingModule, //need for testing !!!
    LoggerModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
