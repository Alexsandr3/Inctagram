import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiConfigModule } from './modules/api-config/api.config.module';
import { MailModule } from './providers/mailer/mail.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ApiConfigModule, MailModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
