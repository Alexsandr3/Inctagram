import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

/**
 * @description Logout command
 */
export class LogoutCommand {
  constructor() {}
}

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor() {}

  /**
   * @description logout user from all devices
   * @param command
   */
  async execute(command: LogoutCommand): Promise<boolean> {
    return;
  }
}
