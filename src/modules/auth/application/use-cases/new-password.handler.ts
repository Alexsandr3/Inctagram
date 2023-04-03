import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordInputDto } from '../../api/input-dto/new-password.input.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { AuthService } from '../auth.service';
import { PasswordRecoveryRepository } from '../../infrastructure/password-recovery.repository';

/**
 * @description - command for new password
 */
export class NewPasswordCommand {
  constructor(public readonly dto: NewPasswordInputDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordHandler implements ICommandHandler<NewPasswordCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
    private readonly passwordRepository: PasswordRecoveryRepository,
  ) {}

  /**
   * @description - handler for new password
   * @param command
   */
  async execute(command: NewPasswordCommand): Promise<boolean> {
    const { newPassword, recoveryCode } = command.dto;

    const passwordRecovery = await this.passwordRepository.findPassRecovery(recoveryCode);
    if (!passwordRecovery) return false;

    if (new Date() > passwordRecovery.expirationDate) {
      await this.passwordRepository.deletePassRecovery(recoveryCode);
      return false;
    }

    const foundUser = await this.usersRepository.findUserByEmail(passwordRecovery.email);
    if (!foundUser) return false;

    const passwordHash = await this.authService.getPasswordHash(newPassword);

    foundUser.updatePassword(passwordHash);
    await this.usersRepository.saveUser(foundUser);

    await this.passwordRepository.deletePassRecovery(recoveryCode);
    return true;
  }
}
