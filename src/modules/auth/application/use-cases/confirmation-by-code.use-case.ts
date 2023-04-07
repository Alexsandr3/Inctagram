import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmationCodeInputDto } from '../../api/input-dto/confirmation-code.input.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { ResultNotification } from '../../../../main/validators/result-notification';

/**
 * @description confirm user by code
 */
export class ConfirmByCodeCommand {
  constructor(public readonly codeInputModel: ConfirmationCodeInputDto) {}
}

@CommandHandler(ConfirmByCodeCommand)
export class ConfirmByCodeUseCase implements ICommandHandler<ConfirmByCodeCommand> {
  constructor(protected usersRepository: UsersRepository) {}

  /**
   * @description confirm user by code
   * @param command
   */
  async execute(command: ConfirmByCodeCommand): Promise<ResultNotification> {
    const { confirmationCode } = command.codeInputModel;
    //prepare a notification for result
    const notification = new ResultNotification();

    const foundUser = await this.usersRepository.findUserByConfirmationCode(confirmationCode);
    if (!foundUser) return notification;

    const { emailConfirmation } = foundUser;
    if (
      emailConfirmation.isConfirmed ||
      emailConfirmation.codeExpirationDate < new Date() ||
      emailConfirmation.confirmationCode !== confirmationCode
    ) {
      notification.addError('Confirmation code is invalid', 'code', 2);
      return notification;
    }

    foundUser.confirmUser();
    await this.usersRepository.saveUser(foundUser);
    return notification;
  }
}
