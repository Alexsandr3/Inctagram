import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResultNotification } from '../../../../main/validators/result-notification';

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
    const notification = new ResultNotification();
    return;
  }
}
