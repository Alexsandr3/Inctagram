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
  constructor(public readonly userInputModel: RegisterInputDto) {}
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
    const { userName, email, password } = command.userInputModel;

    const foundUser = await this.usersRepository.findUserByNameOrEmail(userName, email);

    if (foundUser) {
      const field = foundUser.userName.toLowerCase() === userName.toLowerCase() ? 'userName' : 'email';
      throw new NotificationException(`User with this ${field} is already exist`, field, NotificationCode.BAD_REQUEST);
    }

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
}
