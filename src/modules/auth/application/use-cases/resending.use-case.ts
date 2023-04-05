import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';
import { RegistrationEmailResendingInputDto } from '../../api/input-dto/registration-email-resending.input.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { ResultNotification } from '../../../../main/walidators/result-notification';

/**
 * @description Resending command
 */
export class ResendingCommand {
  constructor(public dto: RegistrationEmailResendingInputDto) {}
}

@CommandHandler(ResendingCommand)
export class ResendingUseCase implements ICommandHandler<ResendingCommand> {
  constructor(protected usersRepository: UsersRepository, private readonly mailService: MailManager) {}

  /**
   * Resending code confirmation
   * @param command
   */
  async execute(command: ResendingCommand) {
    const { email } = command.dto;
    //prepare a notification for result
    const notification = new ResultNotification();
    const foundUser = await this.usersRepository.findUserByEmail(email);
    if (!foundUser || foundUser.emailConfirmation.isConfirmed) {
      notification.addError("Email isn't valid or already confirmed", 'email', 2);
      return notification;
    }
    foundUser.updateEmailConfirmation();
    await this.usersRepository.saveUser(foundUser);
    await this.mailService.sendUserConfirmation(email, foundUser.emailConfirmation.confirmationCode);
    return notification;
  }
}
