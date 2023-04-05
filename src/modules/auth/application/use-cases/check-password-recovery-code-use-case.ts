import { PasswordRecoveryCodeInputDto } from '../../api/input-dto/password-recovery-code.input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordRecoveryRepository } from '../../infrastructure/password-recovery.repository';
import { BadRequestException } from '@nestjs/common';

export class CheckPasswordRecoveryCodeCommand {
  constructor(public dto: PasswordRecoveryCodeInputDto) {}
}

@CommandHandler(CheckPasswordRecoveryCodeCommand)
export class CheckPasswordRecoveryCodeUseCase implements ICommandHandler<CheckPasswordRecoveryCodeCommand> {
  constructor(protected passwordRepository: PasswordRecoveryRepository) {}
  async execute(command: CheckPasswordRecoveryCodeCommand): Promise<string> {
    const passwordRecovery = await this.passwordRepository.findPassRecovery(command.dto.recoveryCode);
    if (!passwordRecovery) throw new BadRequestException('Code is not valid', 'code');
    return passwordRecovery.email;
  }
}
