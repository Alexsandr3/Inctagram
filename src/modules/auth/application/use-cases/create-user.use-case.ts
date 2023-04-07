import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';
import { RegisterInputDto } from '../../api/input-dto/register.input.dto';
import { User } from '../../../users/domain/user.entity';
import { AuthService } from '../auth.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { ResultNotification } from '../../../../main/validators/result-notification';

/**
 * @description create new user and send email for confirmation
 */
export class CreateUserCommand {
  constructor(public readonly userInputModel: RegisterInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailManager,
  ) {}

  /**
   * @description create new user and send email for confirmation
   * @param command
   */
  async execute(command: CreateUserCommand): Promise<ResultNotification> {
    const { email, password } = command.userInputModel;
    //prepare a notification for result
    const notification = new ResultNotification();
    //check email for uniqueness
    const existsUser = await this.usersRepository.findUserByEmail(email);
    if (existsUser) {
      notification.addError('User with this email is already\n' + 'registered', 'email', 2);
      return notification;
    }
    //generate password hash
    const passwordHash = await this.authService.getPasswordHash(password);
    //create user
    const user = new User(email, passwordHash);
    //save user
    await this.usersRepository.saveUser(user);
    await this.mailService.sendUserConfirmation(email, user.emailConfirmation.confirmationCode);
    return notification;
  }
}
