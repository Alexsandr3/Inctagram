import { ISessionsRepository, PrismaSessionsRepository } from './infrastructure/sessions-repository';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: ISessionsRepository,
      useClass: PrismaSessionsRepository,
    },
  ],
  exports: [ISessionsRepository],
})
export class SessionsModule {}
