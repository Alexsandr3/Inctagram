import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmationCodeInputDto } from '../../api/input-dto/confirmation-code.input.dto';

/**
 * @description confirm user by code
 */
export class ConfirmByCodeCommand {
  constructor(public readonly codeInputModel: ConfirmationCodeInputDto) {}
}

@CommandHandler(ConfirmByCodeCommand)
export class ConfirmByCodeHandler implements ICommandHandler<ConfirmByCodeCommand> {
  constructor() {}

  /**
   * @description confirm user by code
   * @param command
   */
  async execute(command: ConfirmByCodeCommand): Promise<boolean> {
    const { code } = command.codeInputModel;
    return;
  }
}
