import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { AuthService } from '../auth.service';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { RegisterUserFromExternalAccountInputDto } from '../../api/input-dto/register-user-from-external-account-input.dto';
import { UserEntity, userFieldParameters } from '../../../users/domain/user.entity';
import { randomUUID } from 'crypto';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';
import { ConfirmationOfExternalAccountEntity } from '../../domain/confirmation-of-external-account.entity';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';

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

  async executeUseCase(command: RegisterUserFromExternalAccountCommand): Promise<void> {
    const { dto } = command;
    const userId = await this.usersRepository.findUserByProviderId(String(dto.providerId));
    if (userId)
      throw new NotificationException(
        `User with ${dto.provider} id: ${dto.providerId} is already register`,
        `${dto.provider} id`,
        NotificationCode.BAD_REQUEST,
      );

    let user = await this.usersRepository.findUserByEmail(dto.email);
    if (!user) {
      user = await this.createUserByExternalAccount(dto);
      await this.usersRepository.saveUser(user);
      await this.mailService.sendMailWithSuccessRegistration(dto.email); //todo
    } else {
      user.addExternalAccountToUser(dto);
      const confirmationOfExternalAccount = ConfirmationOfExternalAccountEntity.initCreate(dto.providerId);
      await this.usersRepository.addExternalAccountToUser(user, confirmationOfExternalAccount);

      await this.mailService.sendUserConfirmation(dto.email, confirmationOfExternalAccount.confirmationCode); //todo
    }
  }

  private async createUserByExternalAccount(dto: RegisterUserFromExternalAccountInputDto): Promise<UserEntity> {
    const userName = await this.setUserName(dto.displayName);
    //generate password hash
    const passwordHash = await this.authService.getPasswordHash(randomUUID());
    //create user
    return UserEntity.createUserFromExternalAccount(userName, passwordHash, dto);
  }

  private async setUserName(userName: string): Promise<string> {
    let foundUser: UserEntity;

    //if don`t get displayName from external accounts or userName length longer than needed - generate it
    if (!userName || userName.length > userFieldParameters.userNameLength.max || !userName.match('^[a-zA-Z0-9_-]*$'))
      userName = await this.generateUserName();
    //if userName length shorter than needed - extend it value
    if (userName.length < userFieldParameters.userNameLength.min) {
      const countCorrectingSymbols = userFieldParameters.userNameLength.min - userName.length;
      userName = this.correctShortUserName(userName, countCorrectingSymbols);
    }

    do {
      foundUser = await this.usersRepository.findUserByUserName(userName);
      if (foundUser) {
        do {
          userName = this.correctUserName(userName);
        } while (userName.length < userFieldParameters.userNameLength.min);
      }
      if (userName.length > userFieldParameters.userNameLength.max) userName = await this.generateUserName();
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
    if (!userName.includes('_')) return userName + '_0';

    const userNameParts = userName.split('_');

    const lastPart = Number(userNameParts[userNameParts.length - 1]);
    if (isNaN(lastPart)) return userName + '_0';

    const addedValue = lastPart + 1;
    userNameParts[userNameParts.length - 1] = String(addedValue);

    return userNameParts.join('_');
  }
}
