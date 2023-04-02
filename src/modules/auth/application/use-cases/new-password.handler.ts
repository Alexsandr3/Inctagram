import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordInputDto } from '../../api/input-dto/new-password.input.dto';

/**
 * @description - command for new password
 */
export class NewPasswordCommand {
  constructor(body: NewPasswordInputDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordHandler implements ICommandHandler<NewPasswordCommand> {
  constructor() {}

  /**
   * @description - handler for new password
   * @param command
   */
  async execute(command: NewPasswordCommand) {}
}
