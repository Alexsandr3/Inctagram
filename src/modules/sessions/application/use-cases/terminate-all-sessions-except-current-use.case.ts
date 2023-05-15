import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { ISessionsRepository } from '../../infrastructure/sessions-repository';
import { SessionsService } from '../sessions.service';

export class TerminateAllSessionsExceptCurrentCommand {
  constructor(public readonly userId: number, public readonly deviceId: number) {}
}

@CommandHandler(TerminateAllSessionsExceptCurrentCommand)
export class TerminateAllSessionsExceptCurrentUseCase
  extends BaseNotificationUseCase<TerminateAllSessionsExceptCurrentCommand, void>
  implements ICommandHandler<TerminateAllSessionsExceptCurrentCommand>
{
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly sessionsRepository: ISessionsRepository,
  ) {
    super();
  }

  /**
   * @description Terminate all sessions except current
   * @param command
   */
  async executeUseCase(command: TerminateAllSessionsExceptCurrentCommand): Promise<void> {
    const { userId, deviceId } = command;
    //find current session
    await this.sessionsService.findSessionByDeviceId(deviceId, userId);
    //remove all sessions except current where userId = userId and deviceId != deviceId
    await this.sessionsRepository.deleteAllSessionsExceptCurrent(deviceId, userId);
  }
}
