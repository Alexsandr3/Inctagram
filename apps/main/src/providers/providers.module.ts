import { Module } from '@nestjs/common';
import { MailModule } from './mailer/mail.module';
import { LoggerModule } from '@common/modules/logger/logger.module';
import { PrismaModule } from './prisma/prisma.module';
import { SchedulerModule } from './schedulerModule/scheduler.module';
import { TestingModule } from './testing/testing.module';

@Module({
  imports: [MailModule, LoggerModule, PrismaModule, SchedulerModule, TestingModule],
})
export class ProvidersModule {}
