import { ISessionsRepository, PrismaSessionsRepository } from './infrastructure/sessions-repository';
import { Module } from '@nestjs/common';
import { SessionsController } from './api/sessions.controller';
import { ISessionsQueryRepository, PrismaSessionsQueryRepository } from './infrastructure/sessions-query-repository';
import { DeleteSelectedSessionUseCase } from './application/use-cases/delete-selected-session-use.case';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminateAllSessionsExceptCurrentUseCase } from './application/use-cases/terminate-all-sessions-except-current-use.case';
import { SessionsService } from './application/sessions.service';
import { ApiJwtModule } from '../api-jwt/api-jwt.module';

const useCases = [DeleteSelectedSessionUseCase, TerminateAllSessionsExceptCurrentUseCase];
@Module({
  imports: [CqrsModule, ApiJwtModule],
  controllers: [SessionsController],
  providers: [
    SessionsService,
    ...useCases,
    {
      provide: ISessionsRepository,
      useClass: PrismaSessionsRepository,
    },
    {
      provide: ISessionsQueryRepository,
      useClass: PrismaSessionsQueryRepository,
    },
  ],
  exports: [ISessionsRepository],
})
export class SessionsModule {}
