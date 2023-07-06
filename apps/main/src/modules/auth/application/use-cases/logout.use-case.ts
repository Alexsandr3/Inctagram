import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ISessionsRepository } from '../../../sessions/infrastructure/sessions-repository';
import { NotificationException } from '@common/main/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';

/**
 * @description Logout command
 */
export class LogoutCommand {
  constructor(public userId: number, public deviceId: number) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase
  extends BaseNotificationUseCase<LogoutCommand, void>
  implements ICommandHandler<LogoutCommand>
{
  constructor(protected sessionsRepository: ISessionsRepository) {
    super();
  }

  /**
   * @description logout user from all devices
   * @param command
   */
  async executeUseCase(command: LogoutCommand) {
    const { userId, deviceId } = command;

    const foundSession = await this.sessionsRepository.findSessionByDeviceId(deviceId);
    if (!foundSession) throw new NotificationException('Session not found', 'session', NotificationCode.NOT_FOUND);
    if (!foundSession.hasOwner(userId))
      throw new NotificationException(
        "You don't have permission to delete this session",
        'session',
        NotificationCode.FORBIDDEN,
      );

    await this.sessionsRepository.deleteSessionByDeviceId(deviceId);
  }
}
