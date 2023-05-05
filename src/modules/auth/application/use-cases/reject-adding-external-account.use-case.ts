import { ConfirmationCodeInputDto } from '../../api/input-dto/confirmation-code.input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { AuthService } from '../auth.service';

/**
 * @description confirm adding External Account to user by code
 */
export class RejectAddingExternalAccountCommand {
  constructor(public readonly codeInputModel: ConfirmationCodeInputDto) {}
}

@CommandHandler(RejectAddingExternalAccountCommand)
export class RejectAddingExternalAccountUseCase
  extends BaseNotificationUseCase<RejectAddingExternalAccountCommand, void>
  implements ICommandHandler<RejectAddingExternalAccountCommand>
{
  constructor(protected usersRepository: IUsersRepository, protected authService: AuthService) {
    super();
  }

  /**
   * @description confirm adding External Account to user by code
   * @param command
   */
  async executeUseCase(command: RejectAddingExternalAccountCommand) {
    const { foundUser, providerId } = await this.authService.checkConfirmationCodeForAddingExternalAccount(
      command.codeInputModel.confirmationCode,
    );

    await this.usersRepository.deleteUserExternalAccount(foundUser, providerId);
  }
}
