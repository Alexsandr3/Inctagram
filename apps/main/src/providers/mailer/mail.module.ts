import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailManager } from './application/mail-manager.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailAdapter } from './email.adapter';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

@Global() // 👈 global module
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => {
        return {
          transport: {
            service: 'gmail',
            // host: 'smtp.example.com',
            secure: false,
            auth: {
              user: configService.MAIL_USER,
              pass: configService.MAIL_PASSWORD,
            },
          },
          /*defaults: {
            from: '"Free help 🔐" <forexperienceinincubatore@gmail.com>', // sender address
          },*/
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    ApiConfigModule,
  ],
  providers: [MailManager, EmailAdapter],
  exports: [MailManager], // 👈 export for DI
})
export class MailModule {}
