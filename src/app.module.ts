import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiConfigModule } from './modules/api-config/api.config.module';
import { MailModule } from './providers/mailer/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ApiJwtModule } from './modules/api-jwt/api-jwt.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { DatabaseModule } from './providers/database/database.module';
import { TestingModule } from './providers/testing/testing.module';

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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
