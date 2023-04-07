import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';
import { RegisterInputDto } from '../../api/input-dto/register.input.dto';
import { User } from '../../../users/domain/user.entity';
import { AuthService } from '../auth.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BaseNotificationUseCase } from './base-notification.use-case';
import { NotificationException } from '../../../../main/validators/result-notification';

/**
 * @description create new user and send email for confirmation
 */
export class NewCreateUserCommand {
  constructor(public readonly userInputModel: RegisterInputDto) {}
}

@CommandHandler(NewCreateUserCommand)
export class NewCreateUserUseCase
  extends BaseNotificationUseCase<NewCreateUserCommand, number>
  implements ICommandHandler<NewCreateUserCommand>
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

  async executeUseCase(command) {
    const { email, password } = command.userInputModel; //prepare a notification for result

    const existsUser = await this.usersRepository.findUserByEmail(email); //throw new NotificationException('Code is not valid', 'code', 2);
    if (existsUser) throw new NotificationException('User with this email is already exist', 'email', 2);

    const passwordHash = await this.authService.getPasswordHash(password); //generate password hash

    const user = new User(email, passwordHash); //create user

    await this.usersRepository.saveUser(user); //save user
    await this.mailService.sendUserConfirmation(email, user.emailConfirmation.confirmationCode);
  }
}
