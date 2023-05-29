import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmationCodeInputDto } from '../../api/input-dto/confirmation-code.input.dto';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { NotificationException } from '../../../../main/validators/result-notification';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationCode } from '../../../../configuration/notificationCode';

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

    const { foundUser, foundEmailConfirmation } =
      await this.usersRepository.findUserWithEmailConfirmationByConfirmationCode(confirmationCode);
    if (!foundUser) throw new NotificationException('User not found', null, NotificationCode.NOT_FOUND);

    if (foundUser.validateConfirmationCodeAndStatus(foundEmailConfirmation, confirmationCode))
      throw new NotificationException('Confirmation code is invalid', 'code', NotificationCode.BAD_REQUEST);

    foundUser.confirmUser();
    await this.usersRepository.updateUser(foundUser);
  }
}
