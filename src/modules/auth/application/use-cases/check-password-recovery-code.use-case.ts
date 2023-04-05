import { PasswordRecoveryCodeInputDto } from '../../api/input-dto/password-recovery-code.input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordRecoveryRepository } from '../../infrastructure/password-recovery.repository';
import { ResultNotification } from '../../../../main/validators/result-notification';

/**
 * @description check if the recovery code is valid
 */
export class CheckPasswordRecoveryCodeCommand {
  constructor(public dto: PasswordRecoveryCodeInputDto) {}
}

@CommandHandler(CheckPasswordRecoveryCodeCommand)
export class CheckPasswordRecoveryCodeUseCase implements ICommandHandler<CheckPasswordRecoveryCodeCommand> {
  constructor(protected passwordRepository: PasswordRecoveryRepository) {}

  /**
   * Check if the recovery code is valid
   * @param command
   */
  async execute(command: CheckPasswordRecoveryCodeCommand): Promise<ResultNotification<string>> {
    //prepare a notification for result
    const notification = new ResultNotification<string>();
    const passwordRecovery = await this.passwordRepository.findPassRecovery(command.dto.recoveryCode);
    if (!passwordRecovery) {
      notification.addError('Code is not valid', 'code', 2);
      return notification;
    }
    notification.addData(passwordRecovery.email);
    return notification;
  }
}
