import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmationCodeInputDto } from '../../api/input-dto/confirmation-code.input.dto';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { NotificationException } from '../../../../main/validators/result-notification';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationCode } from '../../../../configuration/exception.filter';

/**
 * @description confirm user by code
 */
export class ConfirmRegistrationCommand {
  constructor(public readonly codeInputModel: ConfirmationCodeInputDto) {}
}

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationUseCase
  extends BaseNotificationUseCase<ConfirmRegistrationCommand, void>
  implements ICommandHandler<ConfirmRegistrationCommand>
{
  constructor(protected usersRepository: IUsersRepository) {
    super();
  }

  /**
   * @description confirm user by code
   * @param command
   */
  async executeUseCase(command: ConfirmRegistrationCommand) {
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
    await this.usersRepository.updateUser(foundUser);
  }
}
