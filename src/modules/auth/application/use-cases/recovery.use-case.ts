import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { PasswordRecoveryRepository } from '../../infrastructure/password-recovery.repository';
import { PasswordRecovery } from '../../domain/password-recovery.entity';
import { ResultNotification } from '../../../../main/validators/result-notification';
import { RecaptchaAdapter } from '../../../../providers/recaptcha/recaptcha.adapter';

/**
 * Recovery password
 */
export class RecoveryCommand {
  constructor(
    public readonly email: string,
    public readonly recaptchaOn: boolean,
    public readonly recaptcha?: string,
  ) {}
}

@CommandHandler(RecoveryCommand)
export class RecoveryUseCase implements ICommandHandler<RecoveryCommand> {
  constructor(
    protected usersRepository: UsersRepository,
    protected passwordRepository: PasswordRecoveryRepository,
    private readonly mailService: MailManager,
    private readonly recaptchaAdapter: RecaptchaAdapter,
  ) {}

  /**
   *  Recovery password
   * @param command
   */
  async execute(command: RecoveryCommand): Promise<ResultNotification> {
    const { email, recaptcha, recaptchaOn } = command;
    //prepare a notification for result
    const notification = new ResultNotification();
    //check recaptcha and validate
    if (recaptchaOn) {
      const isSuccessRecaptcha = await this.recaptchaAdapter.validateRecaptcha(recaptcha);
      if (!isSuccessRecaptcha.success) {
        notification.addError('Invalid recaptcha', 'recaptcha', 1);
        return notification;
      }
    }
    //search user by login or email
    const isUserExist = await this.usersRepository.findUserByEmail(email);
    if (!isUserExist) return notification;
    const passwordRecovery = new PasswordRecovery(email);
    await this.passwordRepository.savePassRecovery(passwordRecovery);

    await this.mailService.sendPasswordRecoveryMessage(email, passwordRecovery.recoveryCode);
    return notification;
  }
}
