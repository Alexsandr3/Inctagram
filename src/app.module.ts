import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiConfigModule } from './modules/api-config/api.config.module';
import { MailModule } from './providers/mailer/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ApiJwtModule } from './modules/api-jwt/api-jwt.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { DatabaseModule } from './providers/database/database.module';
import { TestingModule } from './providers/testing/testing.module';
import { LoggerModule } from './providers/logger/logger.module';
import LogsMiddleware from './providers/logger/logs.middleware';

@Module({
  imports: [
    ApiConfigModule,
    MailModule,
    AuthModule,
    UsersModule,
    ApiJwtModule,
    SessionsModule,
    DatabaseModule,
    TestingModule, //need for testing !!!
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogsMiddleware)
      .exclude(
        '/api/swagger-ui-bundle.js',
        'api/swagger-ui-init.js',
        'api/swagger-ui.css',
        'api/swagger-ui-standalone-preset.js',
      )
      .forRoutes('*');
  }
}
