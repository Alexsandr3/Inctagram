import { Controller, Delete, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ISessionsQueryRepository } from '../infrastructure/sessions-query-repository';
import {
  SwaggerDecoratorsByDeleteAllSessionsExceptCurrent,
  SwaggerDecoratorsByDeleteSelectedSession,
  SwaggerDecoratorsByGetUserSessions,
} from '../swagger/swagger.sessions.decorators';
import { DevicesViewModel } from './session.view.dto';
import { CommandBus } from '@nestjs/cqrs';
import { ResultNotification } from '@common/main/validators/result-notification';
import { SessionData } from '../../../main/decorators/session-data.decorator';
import { SessionDto } from '../application/dto/SessionDto';
import { DeleteSelectedSessionCommand } from '../application/use-cases/delete-selected-session-use.case';
import { TerminateAllSessionsExceptCurrentCommand } from '../application/use-cases/terminate-all-sessions-except-current-use.case';
import { HTTP_Status } from '@common/main/enums/http-status.enum';
import { RefreshTokenGuard } from '../../../main/guards/refresh-token.guard';

@ApiTags(`Device's`)
@ApiBearerAuth()
@UseGuards(RefreshTokenGuard)
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsQueryRepository: ISessionsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * @description Get all user's sessions
   * @param sessionData
   */
  @SwaggerDecoratorsByGetUserSessions()
  @HttpCode(HTTP_Status.OK_200)
  @Get()
  async getUserSessions(@SessionData() sessionData: SessionDto): Promise<DevicesViewModel> {
    const sessions = await this.sessionsQueryRepository.findSessionsByUserId(sessionData.userId);
    return new DevicesViewModel(sessions, sessionData.deviceId);
  }

  /**
   * @description Delete selected session
   * @param deviceId
   * @param sessionData
   */
  @SwaggerDecoratorsByDeleteSelectedSession()
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  @Delete(':deviceId')
  async deleteSelectedSession(
    @Param('deviceId') deviceId: number,
    @SessionData() sessionData: SessionDto,
  ): Promise<void> {
    await this.commandBus.execute<DeleteSelectedSessionCommand, ResultNotification<void>>(
      new DeleteSelectedSessionCommand(sessionData.userId, deviceId, sessionData.deviceId),
    );
  }

  /**
   * @description Terminate all sessions except current
   * @param sessionData
   */
  @SwaggerDecoratorsByDeleteAllSessionsExceptCurrent()
  @Delete()
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async terminateAllSessionsExceptCurrent(@SessionData() sessionData: SessionDto): Promise<void> {
    await this.commandBus.execute<TerminateAllSessionsExceptCurrentCommand, ResultNotification<void>>(
      new TerminateAllSessionsExceptCurrentCommand(sessionData.userId, sessionData.deviceId),
    );
  }
}
