import { ConfirmationCodeInputDto } from '../../api/input-dto/confirmation-code.input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { AuthService } from '../auth.service';
import { TokensType } from '../types/types';

/**
 * @description confirm adding External Account to user by code
 */
export class ConfirmAddingExternalAccountCommand {
  constructor(public codeInputModel: ConfirmationCodeInputDto, public ip: string, public deviceName: string) {}
}

@CommandHandler(ConfirmAddingExternalAccountCommand)
export class ConfirmAddingExternalAccountUseCase
  extends BaseNotificationUseCase<ConfirmAddingExternalAccountCommand, TokensType>
  implements ICommandHandler<ConfirmAddingExternalAccountCommand>
{
  constructor(protected usersRepository: IUsersRepository, protected authService: AuthService) {
    super();
  }

  /**
   * @description confirm adding External Account to user by code
   * @param command
   */
  async executeUseCase(command: ConfirmAddingExternalAccountCommand): Promise<TokensType> {
    const { codeInputModel, ip, deviceName } = command;

    const { foundUser, providerId } = await this.authService.checkConfirmationCodeForAddingExternalAccount(
      codeInputModel.confirmationCode,
    );

    foundUser.confirmExternalAccount(providerId);
    await this.usersRepository.updateUserExternalAccount(foundUser);
    return this.authService.loginUser({ userId: foundUser.id, ip, deviceName });
  }
}
