import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

/**
 * @description Refresh command
 */
export class RefreshCommand {
  constructor() {}
}

@CommandHandler(RefreshCommand)
export class RefreshUseCase implements ICommandHandler<RefreshCommand> {
  constructor() {}

  /**
   * Refresh tokens
   * @param command
   */
  async execute(command: RefreshCommand) {
    return;
  }
}
