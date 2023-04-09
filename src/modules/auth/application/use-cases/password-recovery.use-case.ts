import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { IPasswordRecoveryRepository } from '../../infrastructure/password-recovery.repository';
import { PasswordRecoveryEntity } from '../../domain/password-recovery.entity';
import { NotificationException } from '../../../../main/validators/result-notification';
import { RecaptchaAdapter } from '../../../../providers/recaptcha/recaptcha.adapter';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationCode } from '../../../../configuration/exception.filter';

/**
 * Recovery password
 */
export class PasswordRecoveryCommand {
  constructor(
    public readonly email: string,
    public readonly recaptchaOn: boolean,
    public readonly recaptcha?: string,
  ) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  extends BaseNotificationUseCase<PasswordRecoveryCommand, void>
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    protected usersRepository: IUsersRepository,
    protected passwordRepository: IPasswordRecoveryRepository,
    private readonly mailService: MailManager,
    private readonly recaptchaAdapter: RecaptchaAdapter,
  ) {
    super();
  }

  /**
   *  Recovery password
   * @param command
   */
  async executeUseCase(command: PasswordRecoveryCommand) {
    const { email, recaptcha, recaptchaOn } = command;

    //check recaptcha and validate
    if (recaptchaOn) {
      const isSuccessRecaptcha = await this.recaptchaAdapter.validateRecaptcha(recaptcha);
      if (!isSuccessRecaptcha.success)
        throw new NotificationException('Invalid recaptcha', 'recaptcha', NotificationCode.NOT_FOUND);
    }

    //search user by login or email
    const isUserExist = await this.usersRepository.findUserByEmail(email);
    if (!isUserExist) return;

    const passwordRecovery = PasswordRecoveryEntity.initCreate(email);
    await this.passwordRepository.savePassRecovery(passwordRecovery);

    await this.mailService.sendPasswordRecoveryMessage(email, passwordRecovery.recoveryCode);
  }
}
