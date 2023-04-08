import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';
import { RegisterInputDto } from '../../api/input-dto/register.input.dto';
import { User } from '../../../users/domain/user.entity';
import { AuthService } from '../auth.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';

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
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailManager,
  ) {
    super();
  }

  /**
   * @description create new user and send email for confirmation
   * @param command
   */

  async executeUseCase(command: RegisterUserCommand) {
    const { userName, email, password } = command.userInputModel; //prepare a notification for result

    const foundUser = await this.usersRepository.findUserByNameOrEmail(userName, email); //throw new NotificationException('Code is not valid', 'code', 2);
    if (foundUser) {
      if (foundUser.userName.toLowerCase() === userName.toLowerCase())
        throw new NotificationException('User with this name is already exist', 'name', NotificationCode.BAD_REQUEST);
      throw new NotificationException('User with this email is already exist', 'email', NotificationCode.BAD_REQUEST);
    }

    const passwordHash = await this.authService.getPasswordHash(password); //generate password hash

    const user = new User(userName, email, passwordHash); //create user

    await this.usersRepository.saveUser(user); //save user
    await this.mailService.sendUserConfirmation(email, user.emailConfirmation.confirmationCode);
  }
}
