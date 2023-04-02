import { SecurityRepository } from './infrastructure/security.repository';
import { Session } from './domain/session.entity';
import { Module } from '@nestjs/common';

const entities = [Session];

@Module({
  imports: [],
  providers: [SecurityRepository],
  exports: [SecurityRepository],
})
export class SecurityModule {}
