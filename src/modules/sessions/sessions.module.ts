import { ISessionsRepository, SessionsRepository } from './infrastructure/sessions-repository';
import { Session } from './domain/session.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const entities = [Session];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [
    {
      provide: ISessionsRepository,
      useClass: SessionsRepository,
    },
  ],
  exports: [ISessionsRepository],
})
export class SessionsModule {}
