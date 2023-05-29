import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { IPasswordRecoveryRepository } from '../../infrastructure/password-recovery.repository';
import { PasswordRecoveryEntity } from '../../domain/password-recovery.entity';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/notificationCode';

/**
 * Recovery password
 */
export class PasswordRecoveryCommand {
  constructor(public readonly email: string) {}
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
  ) {
    super();
  }

  /**
   *  Recovery password
   * @param command
   */
  async executeUseCase(command: PasswordRecoveryCommand) {
    const { email } = command;
    //search user by login or email
    const isUserExist = await this.usersRepository.findUserByEmail(email);
    if (!isUserExist)
      throw new NotificationException(
        `User with this ${email} is not registered`,
        'email',
        NotificationCode.BAD_REQUEST,
      );

    const passwordRecovery = PasswordRecoveryEntity.initCreate(email);
    await this.passwordRepository.savePassRecovery(passwordRecovery);

    await this.mailService.sendPasswordRecoveryMessage(email, passwordRecovery.recoveryCode);
  }
}
