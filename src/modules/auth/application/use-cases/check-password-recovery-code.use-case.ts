import { PasswordRecoveryCodeInputDto } from '../../api/input-dto/password-recovery-code.input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordRecoveryRepository } from '../../infrastructure/password-recovery.repository';
import { NotificationException } from '../../../../main/validators/result-notification';
import { BaseNotificationUseCase } from './base-notification.use-case';
import { NotificationCode } from '../../../../configuration/exception.filter';

/**
 * @description check if the recovery code is valid
 */
export class CheckPasswordRecoveryCodeCommand {
  constructor(public dto: PasswordRecoveryCodeInputDto) {}
}

type ucResult = { email: string };

@CommandHandler(CheckPasswordRecoveryCodeCommand)
export class CheckPasswordRecoveryCodeUseCase
  extends BaseNotificationUseCase<CheckPasswordRecoveryCodeCommand, ucResult>
  implements ICommandHandler<CheckPasswordRecoveryCodeCommand>
{
  constructor(protected passwordRepository: PasswordRecoveryRepository) {
    super();
  }

  /**
   * Check if the recovery code is valid
   * @param command
   */
  async executeUseCase(command: CheckPasswordRecoveryCodeCommand) {
    const passwordRecovery = await this.passwordRepository.findPassRecovery(command.dto.recoveryCode);
    if (!passwordRecovery) throw new NotificationException('Code is not valid', 'code', NotificationCode.BAD_REQUEST);

    return { email: passwordRecovery.email };
  }
}
