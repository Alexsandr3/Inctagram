import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordInputDto } from '../../api/input-dto/new-password.input.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { AuthService } from '../auth.service';
import { PasswordRecoveryRepository } from '../../infrastructure/password-recovery.repository';
import { ResultNotification } from '../../../../main/validators/result-notification';

/**
 * @description - command for new password
 */
export class NewPasswordCommand {
  constructor(public readonly dto: NewPasswordInputDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase implements ICommandHandler<NewPasswordCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
    private readonly passwordRepository: PasswordRecoveryRepository,
  ) {}

  /**
   * @description - handler for new password
   * @param command
   */
  async execute(command: NewPasswordCommand): Promise<ResultNotification> {
    const { newPassword, recoveryCode } = command.dto;
    const notification = new ResultNotification();
    const passwordRecovery = await this.passwordRepository.findPassRecovery(recoveryCode);
    if (!passwordRecovery) {
      notification.addError('Password recovery code is invalid', 'code', 2);
      return notification;
    }
    if (new Date() > passwordRecovery.expirationDate) {
      await this.passwordRepository.deletePassRecovery(recoveryCode);
      notification.addError('Password recovery code is expired', 'code', 2);
      return notification;
    }
    const foundUser = await this.usersRepository.findUserByEmail(passwordRecovery.email);
    if (!foundUser) {
      notification.addError('User not found', 'code', 2);
      return notification;
    }
    const passwordHash = await this.authService.getPasswordHash(newPassword);

    foundUser.updatePassword(passwordHash);
    await this.usersRepository.saveUser(foundUser);
    await this.passwordRepository.deletePassRecovery(recoveryCode);
    return notification;
  }
}
