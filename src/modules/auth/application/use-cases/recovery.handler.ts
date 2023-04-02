import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordRecoveryInputDto } from '../../api/input-dto/password-recovery.input.dto';
import { MailService } from '../../../../providers/mailer/application/mail.service';

/**
 * Recovery password
 */
export class RecoveryCommand {
  constructor(public readonly emailInputModel: PasswordRecoveryInputDto) {}
}

@CommandHandler(RecoveryCommand)
export class RecoveryHandler implements ICommandHandler<RecoveryCommand> {
  constructor(private readonly mailService: MailService) {}

  /**
   *  Recovery password
   * @param command
   */
  async execute(command: RecoveryCommand): Promise<boolean> {
    const { email } = command.emailInputModel;
    //search user by login or email
    return;
  }
}
