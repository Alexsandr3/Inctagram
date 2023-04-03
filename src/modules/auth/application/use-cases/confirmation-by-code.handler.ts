import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmationCodeInputDto } from '../../api/input-dto/confirmation-code.input.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

/**
 * @description confirm user by code
 */
export class ConfirmByCodeCommand {
  constructor(public readonly codeInputModel: ConfirmationCodeInputDto) {}
}

@CommandHandler(ConfirmByCodeCommand)
export class ConfirmByCodeHandler implements ICommandHandler<ConfirmByCodeCommand> {
  constructor(protected usersRepository: UsersRepository) {}

  /**
   * @description confirm user by code
   * @param command
   */
  async execute(command: ConfirmByCodeCommand): Promise<boolean> {
    const { confirmationCode } = command.codeInputModel;

    const foundUser = await this.usersRepository.findUserByConfirmationCode(confirmationCode);
    if (!foundUser) return false;

    const { emailConfirmation } = foundUser;
    if (emailConfirmation.isConfirmed) return false;
    if (emailConfirmation.codeExpirationDate < new Date()) return false;
    if (emailConfirmation.confirmationCode !== confirmationCode) return false;

    foundUser.confirmUser();
    await this.usersRepository.saveUser(foundUser);
    return true;
  }
}
