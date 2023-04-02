import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../../providers/mailer/application/mail.service';
import { RegistrationEmailResendingInputDto } from '../../api/input-dto/registration-email-resending.input.dto';

/**
 * @description Resending command
 */
export class PasswordResendingCommand {
  constructor(body: RegistrationEmailResendingInputDto) {}
}

@CommandHandler(PasswordResendingCommand)
export class PasswordResendingHandler implements ICommandHandler<PasswordResendingCommand> {
  constructor(private readonly mailService: MailService) {}

  /**
   * Resending code confirmation
   * @param command
   */
  async execute(command: PasswordResendingCommand): Promise<boolean> {
    return;
  }
}
