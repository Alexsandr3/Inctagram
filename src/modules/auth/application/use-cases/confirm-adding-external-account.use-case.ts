import { ConfirmationCodeInputDto } from '../../api/input-dto/confirmation-code.input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { AuthService } from '../auth.service';

/**
 * @description confirm adding External Account to user by code
 */
export class ConfirmAddingExternalAccountCommand {
  constructor(public codeInputModel: ConfirmationCodeInputDto) {}
}

@CommandHandler(ConfirmAddingExternalAccountCommand)
export class ConfirmAddingExternalAccountUseCase
  extends BaseNotificationUseCase<ConfirmAddingExternalAccountCommand, void>
  implements ICommandHandler<ConfirmAddingExternalAccountCommand>
{
  constructor(protected usersRepository: IUsersRepository, protected authService: AuthService) {
    super();
  }

  /**
   * @description confirm adding External Account to user by code
   * @param command
   */
  async executeUseCase(command: ConfirmAddingExternalAccountCommand) {
    const { foundUser, providerId } = await this.authService.checkConfirmationCodeForAddingExternalAccount(
      command.codeInputModel.confirmationCode,
    );

    foundUser.confirmExternalAccount(providerId);
    await this.usersRepository.updateUserExternalAccount(foundUser);
  }
}
