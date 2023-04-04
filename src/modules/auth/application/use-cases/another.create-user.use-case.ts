import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';
import { RegisterInputDto } from '../../api/input-dto/register.input.dto';
import { User } from '../../../users/domain/user.entity';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { AuthService } from '../auth.service';
import { ResultNotification } from '../../../../configuration/notification';

/**
 * @description create new user and send email for confirmation
 */
export class CreateUserCommandw {
  constructor(public readonly userInputModel: RegisterInputDto) {}
}

@CommandHandler(CreateUserCommandw)
export class CreateUserHandlerw implements ICommandHandler<CreateUserCommandw> {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailManager,
  ) {}

  /**
   * @description create new user and send email for confirmation
   * @param command
   */
  async execute(command: CreateUserCommandw): Promise<ResultNotification<User>> {
    const { email, password } = command.userInputModel;
    //prepare a notification for result
    const notification = new ResultNotification<User>();
    //check email for uniqueness
    const existsUser = await this.usersRepository.findUserByEmail(email);
    if (existsUser) {
      notification.addError('Email are already exists', null, 1);
      console.log(notification);
      return notification;
    }
    //generate password hash
    const passwordHash = await this.authService.getPasswordHash(password);
    //create user
    const user = new User(email, passwordHash);
    //save user
    await this.usersRepository.saveUser(user);
    await this.mailService.sendUserConfirmation(email, user.emailConfirmation.confirmationCode);
    notification.addData(user);
    return notification;
  }
}

// notification.hasErrors() new CheckerErrorsException ( if status code 400 = throw new BadRequest => exception)
// notification.getData()

// if(notification.hasErrors()){
//throw new Forbidden()
