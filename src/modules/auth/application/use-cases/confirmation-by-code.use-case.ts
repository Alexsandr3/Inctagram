import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmationCodeInputDto } from '../../api/input-dto/confirmation-code.input.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { NotificationException } from '../../../../main/validators/result-notification';
import { BaseNotificationUseCase } from './base-notification.use-case';
import { NotificationCode } from '../../../../configuration/exception.filter';

/**
 * @description confirm user by code
 */
export class ConfirmByCodeCommand {
  constructor(public readonly codeInputModel: ConfirmationCodeInputDto) {}
}

@CommandHandler(ConfirmByCodeCommand)
export class ConfirmByCodeUseCase
  extends BaseNotificationUseCase<ConfirmByCodeCommand, void>
  implements ICommandHandler<ConfirmByCodeCommand>
{
  constructor(protected usersRepository: UsersRepository) {
    super();
  }

  /**
   * @description confirm user by code
   * @param command
   */
  async executeUseCase(command: ConfirmByCodeCommand) {
    const { confirmationCode } = command.codeInputModel;

    const foundUser = await this.usersRepository.findUserByConfirmationCode(confirmationCode);
    if (!foundUser) throw new NotificationException('User not found', null, NotificationCode.NOT_FOUND);

    const { emailConfirmation } = foundUser;
    if (
      emailConfirmation.isConfirmed ||
      emailConfirmation.codeExpirationDate < new Date() ||
      emailConfirmation.confirmationCode !== confirmationCode
    ) {
      throw new NotificationException('Confirmation code is invalid', 'code', NotificationCode.BAD_REQUEST);
    }

    foundUser.confirmUser();
    await this.usersRepository.saveUser(foundUser);
  }
}
