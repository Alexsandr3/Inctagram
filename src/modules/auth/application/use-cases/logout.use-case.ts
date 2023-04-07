import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions-repository.service';
import { NotificationException } from '../../../../main/validators/result-notification';
import { BaseNotificationUseCase } from './base-notification.use-case';
import { NotificationCode } from '../../../../configuration/exception.filter';

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
  constructor(protected sessionsRepository: SessionsRepository) {
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

    if (foundSession.userId !== userId)
      throw new NotificationException(
        "You don't have permission to delete this session",
        'session',
        NotificationCode.FORBIDDEN,
      );

    await this.sessionsRepository.deleteSessionByDeviceId(deviceId);
  }
}
