import { SessionsRepository } from './infrastructure/sessions-repository';
import { Session } from './domain/session.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const entities = [Session];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [SessionsRepository],
  exports: [SessionsRepository],
})
export class SessionsModule {}
