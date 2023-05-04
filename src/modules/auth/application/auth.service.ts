import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LoginInputDto } from '../api/input-dto/login.input.dto';
import { IUsersRepository } from '../../users/infrastructure/users.repository';
import { OAuth2InputDto } from '../api/input-dto/o-auth2.input.dto';
import { Profile } from 'passport-google-oauth20';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(protected usersRepository: IUsersRepository) {}

  /**
   * Checks if the credentials of the user are correct
   * @param dto
   */
  async checkCredentialsOfUser(dto: LoginInputDto): Promise<number | null> {
    const foundUser = await this.usersRepository.findUserByEmail(dto.email);

    if (!foundUser || !foundUser.isConfirmed || !(await this.passwordIsCorrect(dto.password, foundUser.passwordHash)))
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
      this.logger.log(`User with providerId ${dto.providerId} not found`);
      return null;
    }

    const externalAccount = foundUser.externalAccounts.find(a => a.providerId === dto.providerId);
    if (!externalAccount.isConfirmed) {
      this.logger.log(`Account with providerId ${dto.providerId} is not confirmed`);
      return null;
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
      throw new BadRequestException([
        {
          message: `Invalid email from ${provider} or email is not provided`,
          field: 'email',
        },
      ]);

    if (!profile.id)
      throw new BadRequestException([
        {
          message: `Invalid ${provider} id or ${provider} id is not provided`,
          field: `${provider} id`,
        },
      ]);

    const userId = await this.usersRepository.findUserByProviderId(profile.id);
    if (userId)
      throw new BadRequestException([
        {
          message: `User with ${provider} id: ${profile.id} is already register`,
          field: `${provider} id`,
        },
      ]);
  }
}
