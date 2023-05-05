import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { AuthService } from '../auth.service';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { RegisterUserFromExternalAccountInputDto } from '../../api/input-dto/register-user-from-external-account-input.dto';
import { UserEntity, userFieldParameters } from '../../../users/domain/user.entity';
import { randomUUID } from 'crypto';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';

/**
 * Registration user from external account
 */
export class RegisterUserFromExternalAccountCommand {
  constructor(public dto: RegisterUserFromExternalAccountInputDto) {}
}

@CommandHandler(RegisterUserFromExternalAccountCommand)
export class RegisterUserFromExternalAccountUseCase
  extends BaseNotificationUseCase<RegisterUserFromExternalAccountCommand, void>
  implements ICommandHandler<RegisterUserFromExternalAccountCommand>
{
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: IUsersRepository,
    private readonly mailService: MailManager,
  ) {
    super();
  }

  /**
   * Execute the command action for RegisterUserFromExternalAccountCommand
   * @param command
   */
  async executeUseCase(command: RegisterUserFromExternalAccountCommand): Promise<void> {
    let user = await this.usersRepository.findUserByEmail(command.dto.email);
    if (!user) {
      //create user
      user = await this.createUserByExternalAccount(command.dto);
      await this.usersRepository.saveUser(user);
      await this.mailService.sendMailWithSuccessRegistration(command.dto.email);
    } else {
      //add external account to user
      user.addExternalAccountToUser(command.dto);
      await this.usersRepository.updateUser(user);
      //generate code for confirmation external account
      const code = randomUUID();
      await this.mailService.sendUserConfirmationCodeForExternalAccount(command.dto.email, code);
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
      if (foundUser) userName = this.correctUserName(userName);
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
