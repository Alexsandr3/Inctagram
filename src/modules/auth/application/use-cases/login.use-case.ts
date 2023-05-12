import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensType } from '../types/types';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { AuthService } from '../auth.service';

/**
 * @description login user and return tokens
 */
export class LoginCommand {
  constructor(public readonly userId: number, public readonly ip: string, public readonly deviceName: string) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase
  extends BaseNotificationUseCase<LoginCommand, TokensType>
  implements ICommandHandler<LoginCommand>
{
  constructor(protected authService: AuthService) {
    super();
  }

  /**
   * @description login user and return tokens
   * @param command
   */

  async executeUseCase(command: LoginCommand): Promise<TokensType> {
    return this.authService.loginUser(command);
  }
}
