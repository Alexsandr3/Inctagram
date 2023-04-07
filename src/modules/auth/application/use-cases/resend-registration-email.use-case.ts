import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';
import { RegistrationEmailResendingInputDto } from '../../api/input-dto/registration-email-resending.input.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';

/**
 * @description Resending command
 */
export class ResendRegistrationEmailCommand {
  constructor(public dto: RegistrationEmailResendingInputDto) {}
}

@CommandHandler(ResendRegistrationEmailCommand)
export class ResendRegistrationEmailUseCase
  extends BaseNotificationUseCase<ResendRegistrationEmailCommand, void>
  implements ICommandHandler<ResendRegistrationEmailCommand>
{
  constructor(protected usersRepository: UsersRepository, private readonly mailService: MailManager) {
    super();
  }

  /**
   * Resending code confirmation
   * @param command
   */
  async executeUseCase(command: ResendRegistrationEmailCommand) {
    const { email } = command.dto;

    const foundUser = await this.usersRepository.findUserByEmail(email);
    if (!foundUser || foundUser.emailConfirmation.isConfirmed)
      throw new NotificationException("Email isn't valid or already confirmed", 'email', NotificationCode.BAD_REQUEST);

    foundUser.updateEmailConfirmation();
    await this.usersRepository.saveUser(foundUser);

    await this.mailService.sendUserConfirmation(email, foundUser.emailConfirmation.confirmationCode);
  }
}
