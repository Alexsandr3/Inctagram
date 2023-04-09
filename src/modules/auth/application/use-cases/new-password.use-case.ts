import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordInputDto } from '../../api/input-dto/new-password.input.dto';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { AuthService } from '../auth.service';
import { IPasswordRecoveryRepository } from '../../infrastructure/password-recovery.repository';
import { NotificationException } from '../../../../main/validators/result-notification';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationCode } from '../../../../configuration/exception.filter';

/**
 * @description - command for new password
 */
export class NewPasswordCommand {
  constructor(public readonly dto: NewPasswordInputDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase
  extends BaseNotificationUseCase<NewPasswordCommand, void>
  implements ICommandHandler<NewPasswordCommand>
{
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: IUsersRepository,
    private readonly passwordRepository: IPasswordRecoveryRepository,
  ) {
    super();
  }

  /**
   * @description - handler for new password
   * @param command
   */
  async executeUseCase(command: NewPasswordCommand) {
    const { newPassword, recoveryCode } = command.dto;

    const passwordRecovery = await this.passwordRepository.findPassRecovery(recoveryCode);
    if (!passwordRecovery) {
      throw new NotificationException('Password recovery code is invalid', 'code', NotificationCode.BAD_REQUEST);
    }
    if (new Date() > passwordRecovery.expirationDate) {
      await this.passwordRepository.deletePassRecovery(recoveryCode);
      throw new NotificationException('Password recovery code is expired', 'code', NotificationCode.BAD_REQUEST);
    }
    const foundUser = await this.usersRepository.findUserByEmail(passwordRecovery.email);
    if (!foundUser) {
      throw new NotificationException('User not found', 'code', NotificationCode.BAD_REQUEST);
    }
    const passwordHash = await this.authService.getPasswordHash(newPassword);

    foundUser.updatePassword(passwordHash);
    await this.usersRepository.updateUser(foundUser);
    await this.passwordRepository.deletePassRecovery(recoveryCode);
  }
}
