import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';
import { RegisterInputDto } from '../../api/input-dto/register.input.dto';
import { AuthService } from '../auth.service';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { UserEntity } from '../../../users/domain/user.entity';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailConfirmationEntity } from '../../domain/user.email-confirmation.entity';

/**
 * @description create new user and send email for confirmation
 */
export class RegisterUserCommand {
  constructor(public readonly userInputModel: RegisterInputDto, public enableAutoUserNameCorrection: boolean) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  extends BaseNotificationUseCase<RegisterUserCommand, void>
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: IUsersRepository,
    private readonly mailService: MailManager,
  ) {
    super();
  }

  /**
   * @description create new user and send email for confirmation
   * @param command
   */

  async executeUseCase(command: RegisterUserCommand) {
    //prepare a notification for result
    const { email, password } = command.userInputModel;
    let userName = command.userInputModel.userName;

    let foundUser = await this.usersRepository.findUserByEmail(email);
    if (foundUser)
      throw new NotificationException(
        `User with this ${email} is already exist`,
        'email',
        NotificationCode.BAD_REQUEST,
      );

    foundUser = await this.usersRepository.findUserByUserName(userName);
    if (foundUser && !command.enableAutoUserNameCorrection)
      throw new NotificationException(
        `User with this ${userName} is already exist`,
        'userName',
        NotificationCode.BAD_REQUEST,
      );

    if (foundUser) userName = await this.getUniqueName(userName);

    //generate password hash
    const passwordHash = await this.authService.getPasswordHash(password);
    //create user
    const user = UserEntity.initCreateUser(userName, email, passwordHash);
    //create emailConfirmation
    const emailConfirmation = EmailConfirmationEntity.initCreate();

    //save user with emailConfirmation
    await this.usersRepository.saveUserWithEmailConfirmation(user, emailConfirmation);

    await this.mailService.sendUserConfirmation(email, emailConfirmation.confirmationCode);
  }

  private async getUniqueName(userName: string) {
    userName = userName + '_';
    let foundUser;
    let addedValue = 0;

    do {
      foundUser = await this.usersRepository.findUserByUserName(userName + ++addedValue);
    } while (foundUser);

    return userName + addedValue;
  }
}
