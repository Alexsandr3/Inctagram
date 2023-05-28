import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { LoginInputDto } from '../api/input-dto/login.input.dto';
import { IUsersRepository } from '../../users/infrastructure/users.repository';
import { OAuth2InputDto } from '../api/input-dto/o-auth2.input.dto';
import { Profile } from 'passport-google-oauth20';
import { NotificationException } from '../../../main/validators/result-notification';
import { UserEntity } from '../../users/domain/user.entity';
import { TokensType } from './types/types';
import { SessionEntity } from '../../sessions/domain/session.entity';
import { LoginCommand } from './use-cases/login.use-case';
import { ApiJwtService } from '../../api-jwt/api-jwt.service';
import { ISessionsRepository } from '../../sessions/infrastructure/sessions-repository';
import { OAuthException, OAuthFlowType } from '../../../main/validators/oauth.exception';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { NotificationCode } from '../../../configuration/notificationCode';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    protected usersRepository: IUsersRepository,
    protected apiJwtService: ApiJwtService,
    protected sessionsRepository: ISessionsRepository,
  ) {}

  /**
   * Checks if the credentials of the user are correct
   * @param dto
   */
  async checkCredentialsOfUser(dto: LoginInputDto): Promise<number | null> {
    const foundUser = await this.usersRepository.findUserByEmail(dto.email);

    if (
      !foundUser ||
      !foundUser.hasActiveStatus() ||
      !(await this.passwordIsCorrect(dto.password, foundUser.passwordHash))
    )
      return null;
    return foundUser.id;
  }

  /**
   * Checks if the credentials of the user are correct for OAuth2
   * @param dto
   */
  async checkCredentialsOfUserOAuth2(dto: OAuth2InputDto): Promise<number | null> {
    const foundUser = await this.usersRepository.findUserByProviderId(dto.providerId);
    if (!foundUser) {
      const message = `User with providerId ${dto.providerId} not found`;
      this.logger.log(message);
      throw new OAuthException(message, OAuthFlowType.Authorization, HTTP_Status.UNAUTHORIZED_401);
    }

    const externalAccount = foundUser.externalAccounts.find(a => a.providerId === dto.providerId);
    if (!externalAccount.isConfirmed) {
      const message = `Account with providerId ${dto.providerId} is not confirmed`;
      this.logger.log(message);
      throw new OAuthException(message, OAuthFlowType.Authorization, HTTP_Status.UNAUTHORIZED_401);
    }

    return foundUser.id;
  }

  /**
   * Checks if the password is correct
   * @param password
   * @param passwordHash
   * @private
   */
  private async passwordIsCorrect(password: string, passwordHash: string) {
    return await bcrypt.compare(password, passwordHash);
  }

  /**
   * Returns the password hash
   * @param password
   */
  async getPasswordHash(password: string): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, passwordSalt);
  }

  /**
   * Checks incoming data from external accounts and find user by providerId for OAuth2
   * @param profile
   * @param provider
   */
  async checkIncomingDataFromExternalAccountAndFindUserByProviderId(profile: Profile, provider: string) {
    if (!profile.emails || profile.emails.length === 0 || !profile.emails[0].value)
      throw new OAuthException(
        `Invalid email from ${provider} or email is not provided`,
        OAuthFlowType.Registration,
        HTTP_Status.BAD_REQUEST_400,
      );

    if (!profile.id)
      throw new OAuthException(
        `Invalid ${provider} id or ${provider} id is not provided`,
        OAuthFlowType.Registration,
        HTTP_Status.BAD_REQUEST_400,
      );
  }

  /**
   * Checks confirmation code for adding external account
   * @param confirmationCode
   */
  async checkConfirmationCodeForAddingExternalAccount(
    confirmationCode: string,
  ): Promise<{ foundUser: UserEntity; providerId: string }> {
    const { foundUser, foundConfirmationOfExternalAccount } =
      await this.usersRepository.findUserWithConfirmationOfExternalAccountByConfirmationCode(confirmationCode);
    if (!foundUser) throw new NotificationException('User not found', null, NotificationCode.NOT_FOUND);

    const externalAccount = foundUser.externalAccounts.find(
      a => a.providerId === foundConfirmationOfExternalAccount.providerId,
    );
    if (externalAccount.validateConfirmationCodeAndStatus(foundConfirmationOfExternalAccount, confirmationCode))
      throw new NotificationException('Confirmation code is invalid', 'code', NotificationCode.BAD_REQUEST);
    return { foundUser: foundUser, providerId: foundConfirmationOfExternalAccount.providerId };
  }

  /**
   * Login user and return tokens
   * @param command
   */
  async loginUser(command: LoginCommand): Promise<TokensType> {
    const { userId, deviceName, ip } = command;

    let session = await this.sessionsRepository.newDeviceId();
    const tokens = await this.apiJwtService.createJWT(userId, session.deviceId);
    const refreshTokenData = await this.apiJwtService.getRefreshTokenData(tokens.refreshToken);

    session = SessionEntity.initCreate({ ...refreshTokenData, ip, deviceName });
    await this.sessionsRepository.saveSession(session);

    return tokens;
  }
}
