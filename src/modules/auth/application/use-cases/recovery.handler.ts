import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordRecoveryInputDto } from '../../api/input-dto/password-recovery.input.dto';
import { MailService } from '../../../../providers/mailer/application/mail.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { PasswordRecoveryRepository } from '../../infrastructure/password-recovery.repository';
import { PasswordRecovery } from '../../domain/password-recovery.entity';

/**
 * Recovery password
 */
export class RecoveryCommand {
  constructor(public readonly emailInputModel: PasswordRecoveryInputDto) {}
}

@CommandHandler(RecoveryCommand)
export class RecoveryHandler implements ICommandHandler<RecoveryCommand> {
  constructor(
    protected usersRepository: UsersRepository,
    protected passwordRepository: PasswordRecoveryRepository,
    private readonly mailService: MailService,
  ) {}

  /**
   *  Recovery password
   * @param command
   */
  async execute(command: RecoveryCommand): Promise<boolean> {
    const { email } = command.emailInputModel;
    //search user by login or email
    const isUserExist = await this.usersRepository.findUserByEmail(email);
    if (!isUserExist) return;

    const passwordRecovery = new PasswordRecovery(email);
    await this.passwordRepository.savePassRecovery(passwordRecovery);

    try {
      await this.mailService.sendEmailRecoveryMessage(email, passwordRecovery.recoveryCode);
    } catch (e) {
      console.log(e);
    }
  }
}
