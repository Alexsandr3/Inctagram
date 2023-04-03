import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../../providers/mailer/application/mail.service';
import { RegistrationEmailResendingInputDto } from '../../api/input-dto/registration-email-resending.input.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';

/**
 * @description Resending command
 */
export class ResendingCommand {
  constructor(public dto: RegistrationEmailResendingInputDto) {}
}

@CommandHandler(ResendingCommand)
export class ResendingHandler implements ICommandHandler<ResendingCommand> {
  constructor(protected usersRepository: UsersRepository, private readonly mailService: MailService) {}

  /**
   * Resending code confirmation
   * @param command
   */
  async execute(command: ResendingCommand) {
    const { email } = command.dto;

    const foundUser = await this.usersRepository.findUserByEmail(email);
    if (!foundUser || foundUser.emailConfirmation.isConfirmed)
      throw new BadRequestException([{ field: 'email', message: `Email isn't valid or already confirmed` }]);

    foundUser.updateEmailConfirmation();
    await this.usersRepository.saveUser(foundUser);

    await this.mailService.sendUserConfirmation(email, foundUser.emailConfirmation.confirmationCode);
  }
}
