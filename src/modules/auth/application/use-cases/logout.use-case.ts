import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions-repository.service';
import { ResultNotification } from '../../../../main/validators/result-notification';

/**
 * @description Logout command
 */
export class LogoutCommand {
  constructor(public userId: number, public deviceId: number) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(protected sessionsRepository: SessionsRepository) {}

  /**
   * @description logout user from all devices
   * @param command
   */
  async execute(command: LogoutCommand): Promise<ResultNotification> {
    const { userId, deviceId } = command;
    const notification = new ResultNotification();

    const foundSession = await this.sessionsRepository.findSessionByDeviceId(deviceId);
    if (!foundSession) {
      notification.addError('Session not found', 'session', 1);
      return notification;
    }
    if (foundSession.userId !== userId) {
      notification.addError("You don't have permission to delete this session", 'session', 4);
      return notification;
    }
    await this.sessionsRepository.deleteSessionByDeviceId(deviceId);
    return notification;
  }
}
