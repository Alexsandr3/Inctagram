import { ISessionsRepository, PrismaSessionsRepository } from './infrastructure/sessions-repository';
import { SessionEntity } from './domain/session.entity';
import { Module } from '@nestjs/common';

const entities = [SessionEntity];

@Module({
  imports: [
    // TypeOrmModule.forFeature(entities)
  ],
  providers: [
    {
      provide: ISessionsRepository,
      useClass: PrismaSessionsRepository,
    },
  ],
  exports: [ISessionsRepository],
})
export class SessionsModule {}
