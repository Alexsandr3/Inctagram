import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions-repository.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

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
  async execute(command: LogoutCommand) {
    const { userId, deviceId } = command;

    const foundSession = await this.sessionsRepository.findSessionByDeviceId(deviceId);
    if (!foundSession) throw new NotFoundException('Session not found');
    if (foundSession.userId !== userId) throw new ForbiddenException('You are not allowed to do this');

    await this.sessionsRepository.deleteSessionByDeviceId(deviceId);
  }
}
