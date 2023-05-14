import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { AuthService } from '../auth.service';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { RegisterUserFromExternalAccountInputDto } from '../../api/input-dto/register-user-from-external-account-input.dto';
import { UserEntity, userFieldParameters } from '../../../users/domain/user.entity';
import { randomUUID } from 'crypto';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';
import { ConfirmationOfExternalAccountEntity } from '../../domain/confirmation-of-external-account.entity';
import { TokensType } from '../types/types';
import { OAuthFlowType } from '../../../../main/validators/oauth.exception';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';

/**
 * Registration user from external account
 */
export class RegisterUserFromExternalAccountAndAuthorizeIfNewCommand {
  constructor(public dto: RegisterUserFromExternalAccountInputDto, public ip: string, public deviceName: string) {}
}

@CommandHandler(RegisterUserFromExternalAccountAndAuthorizeIfNewCommand)
export class RegisterUserFromExternalAccountAndAuthorizeIfNewUseCase
  extends BaseNotificationUseCase<RegisterUserFromExternalAccountAndAuthorizeIfNewCommand, TokensType | null>
  implements ICommandHandler<RegisterUserFromExternalAccountAndAuthorizeIfNewCommand>
{
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: IUsersRepository,
    private readonly mailService: MailManager,
  ) {
    super();
  }

  /**
   * Execute the command action for Register User From External Account (Google, GitHub, etc.)
   * @param command
   */
  async executeUseCase(command: RegisterUserFromExternalAccountAndAuthorizeIfNewCommand): Promise<TokensType | null> {
    const { dto, ip, deviceName } = command;
    //check if user with this external account is already register
    let user = await this.usersRepository.findUserByProviderId(String(dto.providerId));
    if (user)
      throw new NotificationException(
        `User with ${dto.provider} id: ${dto.providerId} is already register`,
        OAuthFlowType.Registration,
        NotificationCode.BAD_REQUEST,
      );

    //check if user with this email is already register
    user = await this.usersRepository.findUserByEmail(dto.email);
    if (!user) {
      //create user from external account
      user = await this.createUserByExternalAccount(dto);
      const userId = await this.usersRepository.saveUser(user);
      //send email with success registration without confirmation
      await this.mailService.sendMailWithSuccessRegistration(dto.email);
      return this.authService.loginUser({ userId, ip, deviceName });
    } else {
      //add external account to user
      user.addExternalAccountToUser(dto);
      //create confirmation for external account with code
      const confirmationOfExternalAccount = ConfirmationOfExternalAccountEntity.initCreate(dto.providerId);
      await this.usersRepository.addExternalAccountToUser(user, confirmationOfExternalAccount);
      //send email with confirmation code for external account
      await this.mailService.sendUserConfirmationCodeForExternalAccount(
        dto.email,
        confirmationOfExternalAccount.confirmationCode,
      );
      return null;
    }
  }

  /**
   * Create user from external account
   * @param dto
   * @private
   */
  private async createUserByExternalAccount(dto: RegisterUserFromExternalAccountInputDto): Promise<UserEntity> {
    const userName = await this.setUserName(dto.displayName);
    //generate password hash
    const passwordHash = await this.authService.getPasswordHash(randomUUID());
    //create user
    return UserEntity.createUserFromExternalAccount(userName, passwordHash, dto);
  }

  /**
   * Generate userName with random symbols
   * @param userName
   * @private
   */
  private async setUserName(userName: string): Promise<string> {
    //get min and max length of userName from config default values
    const { max, min } = userFieldParameters.userNameLength;
    let foundUser: UserEntity;

    //if don`t get displayName from external accounts or userName length longer than needed - generate it
    if (!userName || userName.length > max || !userName.match('^[a-zA-Z0-9_-]*$'))
      userName = await this.generateUserName();

    //if userName length shorter than needed - extend it value
    if (userName.length < min) {
      const countCorrectingSymbols = min - userName.length;
      userName = this.correctShortUserName(userName, countCorrectingSymbols);
    }
    do {
      foundUser = await this.usersRepository.findUserByUserName(userName);
      if (foundUser) {
        do {
          userName = this.correctUserName(userName);
        } while (userName.length < min);
      }
      if (userName.length > max) userName = await this.generateUserName();
    } while (foundUser);

    return userName;
  }

  private correctShortUserName(userName: string, countCorrectingSymbols): string {
    userName += '_0' + '0'.repeat(countCorrectingSymbols < 3 ? 0 : countCorrectingSymbols - 2);
    return userName;
  }

  private async generateUserName(): Promise<string> {
    const countUsers = await this.usersRepository.countUsers();
    return 'user_' + (countUsers + 1);
  }

  private correctUserName(userName: string): string {
    const parts = userName.split('_');
    const lastPart = parts[parts.length - 1];

    // Increment the number at the end of the userName
    if (/^\d+$/.test(lastPart)) {
      const newNumber = Number(lastPart) + 1;
      parts[parts.length - 1] = newNumber.toString();
    } else {
      // Append "_0" if there's no number at the end of the userName
      parts.push('0');
    }

    return parts.join('_');

    // if (!userName.includes('_')) return userName + '_0';
    //
    // const userNameParts = userName.split('_');
    //
    // const lastPart = Number(userNameParts[userNameParts.length - 1]);
    // if (isNaN(lastPart)) return userName + '_0';
    //
    // const addedValue = lastPart + 1;
    // userNameParts[userNameParts.length - 1] = String(addedValue);
    //
    // return userNameParts.join('_');
  }
}
