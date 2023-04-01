import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiConfigModule } from './modules/api-config/api.config.module';
import { MailModule } from './providers/mailer/mail.module';

@Module({
  imports: [ApiConfigModule, MailModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
