import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApiJwtService } from '../../../api-jwt/api-jwt.service';
import { SessionsRepository } from '../../../sessions/infrastructure/sessions-repository.service';
import { Session } from '../../../sessions/domain/session.entity';
import { TokensType } from '../types/types';

/**
 * @description login user and return tokens
 */
export class LoginCommand {
  constructor(public readonly userId: number, public readonly ip: string, public readonly deviceName: string) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(protected apiJwtService: ApiJwtService, protected sessionsRepository: SessionsRepository) {}

  /**
   * @description login user and return tokens
   * @param command
   */
  async execute(command: LoginCommand): Promise<TokensType> {
    const { userId, deviceName, ip } = command;

    let session = await this.sessionsRepository.newDeviceId();
    const tokens = await this.apiJwtService.createJWT(userId, session.deviceId);
    const refreshTokenData = await this.apiJwtService.getRefreshTokenData(tokens.refreshToken);

    session = new Session({ ...refreshTokenData, ip, deviceName });
    await this.sessionsRepository.saveSession(session);

    return tokens;
  }
}
